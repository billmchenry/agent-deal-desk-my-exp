import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, Sparkles, Pin, ExternalLink, X, Maximize2, Minimize2, Volume2, VolumeX, SmilePlus, Upload, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMiraPlaceholder, getMiraSuggestions } from '@/lib/placeholders';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ChatMessage, Visualization } from '@/types';
import { toast } from 'sonner';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useIsMobile } from '@/hooks/use-mobile';
import { PinInsightModal } from '@/components/chat/PinInsightModal';
import { IntelligentResponse } from '@/components/chat/IntelligentResponse';
import { ChartCard } from '@/components/visualizations/ChartCard';
import { DataTable } from '@/components/visualizations/DataTable';
import { ListCard } from '@/components/visualizations/ListCard';
import { MetricCard } from '@/components/visualizations/MetricCard';
import { DocumentDropzone } from '@/components/listing/DocumentDropzone';
import { UnifiedProcessingStatus } from '@/components/shared/UnifiedProcessingStatus';
import { UnifiedExtractionSummary } from '@/components/shared/UnifiedExtractionSummary';
import { BatchProcessingStatus } from '@/components/listing/BatchProcessingStatus';
import { BatchExtractionSummary } from '@/components/listing/BatchExtractionSummary';
import { mockExtractDocument } from '@/lib/mockDocumentExtraction';
import { mockExtractContract, transactionChecklistItems } from '@/lib/mockContractExtraction';
import { ManualIntakeFlow } from '@/components/contract/ManualIntakeFlow';
import { ContractExtraction, ClassifiedDocument } from '@/types';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Demo messages to show the chat UI with sample conversations
const demoMessages: ChatMessage[] = [
  {
    id: 'demo-1',
    role: 'user',
    content: 'Why is my GCI down this month?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'demo-2',
    role: 'assistant',
    content: 'Your GCI is down 12% compared to last month. The main factors are:\n\n1. **Lower transaction volume** - You closed 8 deals vs 12 last month\n2. **Smaller average deal size** - $385K avg vs $425K last month\n3. **Market conditions** - Overall market activity in your area is down 8%\n\nWould you like me to show you which agents are underperforming or suggest strategies to improve next month?',
    timestamp: new Date(Date.now() - 290000),
  },
  {
    id: 'demo-3',
    role: 'user',
    content: 'Show my top performers',
    timestamp: new Date(Date.now() - 200000),
  },
  {
    id: 'demo-4',
    role: 'assistant',
    content: 'Here are your top 3 performers this quarter:\n\n🥇 **Sarah Chen** - $1.2M GCI (142% of target)\n🥈 **Marcus Johnson** - $980K GCI (118% of target)\n🥉 **Emily Rodriguez** - $875K GCI (105% of target)\n\nSarah has been exceptional with luxury listings. Would you like tips on replicating her success across the team?',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: 'demo-5',
    role: 'user',
    content: 'Yes, what strategies does Sarah use?',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 'demo-6',
    role: 'assistant',
    content: "Based on Sarah's activity patterns, here are her key strategies:\n\n📱 **High touch follow-ups** - She contacts leads within 5 minutes of inquiry\n🏠 **Open house excellence** - Hosts 3x more open houses than team average\n🤝 **Referral network** - 60% of her deals come from past client referrals\n📊 **Market expertise** - She sends weekly market updates to her sphere\n\nI can help you set up similar workflows for other team members if you'd like!",
    timestamp: new Date(Date.now() - 30000),
  },
];

export function FloatingChat() {
  const { 
    chatHistory, 
    addChatMessage, 
    addPinnedInsight, 
    currentPage, 
    isChatOpen,
    setIsChatOpen,
    listingMode,
    setListingMode,
    pendingExtraction,
    setPendingExtraction,
    submittedListing,
    setSubmittedListing,
    addListing,
    listings,
    startListingFlow,
    // Contract flow
    contractMode,
    setContractMode,
    pendingContract,
    setPendingContract,
    activeListingForContract,
    setActiveListingForContract,
    manualIntakeStep,
    setManualIntakeStep,
    updateListingToContract,
    submittedContract,
    setSubmittedContract,
    // Batch
    batchUploadState,
    setBatchUploadState,
    startBatchFlow,
    updateBatchApproval,
    updateBatchDocuments,
    attachBatchToChecklist,
  } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Start collapsed on non-home pages, expanded only on home when chat is opened
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinMessage, setPendingPinMessage] = useState<ChatMessage | null>(null);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('mira-minimized');
    return saved === 'true';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // When isChatOpen is triggered, expand the chat.
  // IMPORTANT: avoid forcing fullscreen on desktop (it feels like the UI "takes over" the page).
  useEffect(() => {
    if (!isChatOpen) return;

    setIsExpanded(true);

    // Only auto-fullscreen on mobile where the panel would be too cramped.
    if (isHomePage && isMobile) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  }, [isChatOpen, isHomePage, isMobile]);
  
  const { toggle: toggleSpeak, isSpeaking, currentMessageId, speak } = useSpeechSynthesis();

  // Auto-speak new assistant messages
  useEffect(() => {
    if (!autoSpeak || chatHistory.length === 0) return;
    
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (
      lastMessage.role === 'assistant' && 
      lastMessage.id !== lastMessageIdRef.current
    ) {
      lastMessageIdRef.current = lastMessage.id;
      speak(lastMessage.content, lastMessage.id);
    }
  }, [chatHistory, autoSpeak, speak]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInput(finalTranscript);
        } else if (interimTranscript) {
          setInput(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable it in your browser settings.');
        } else if (event.error !== 'aborted') {
          toast.error('Voice input error. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
      toast.info('Listening... Speak now');
    }
  }, [isListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Reset processing state when entering upload mode
  useEffect(() => {
    if (listingMode === 'uploading') {
      setIsProcessingDocument(false);
    }
    if (contractMode === 'uploading') {
      setIsProcessingContract(false);
    }
  }, [listingMode, contractMode]);

  const handleSubmit = async (query: string = input) => {
    if (!query.trim()) return;

    addChatMessage({ role: 'user', content: query });
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateMockResponse(query, currentPage);
      addChatMessage(response);
      setIsTyping(false);
    }, 1500);
  };

  const handlePinClick = (message: ChatMessage) => {
    if (message.isPinnable) {
      setPendingPinMessage(message);
      setPinModalOpen(true);
    }
  };

  const handleConfirmPin = (interval: 'daily' | 'weekly' | 'manual', customName?: string) => {
    if (!pendingPinMessage) return;
    
    const userQuery = chatHistory.find(m => m.role === 'user' && m.timestamp < pendingPinMessage.timestamp)?.content || '';
    const viz = pendingPinMessage.visualizations?.[0];
    
    // Determine type based on visualization or default to metric
    let insightType: 'chart' | 'list' | 'metric' | 'table' = 'metric';
    if (viz) {
      if (viz.type === 'line' || viz.type === 'bar' || viz.type === 'pie' || viz.type === 'area') {
        insightType = 'chart';
      } else if (viz.type === 'list') {
        insightType = 'list';
      } else if (viz.type === 'table') {
        insightType = 'table';
      }
    }
    
    addPinnedInsight({
      query: userQuery,
      title: viz?.title || 'Insight',
      customName: customName,
      content: pendingPinMessage.content,
      type: insightType,
      data: viz?.data,
      queryParameters: {
        originalQuery: userQuery,
        queryType: insightType,
      },
      conversationId: pendingPinMessage.id,
      refreshInterval: interval,
    });
    
    toast.success('Insight pinned to your Pulse!', {
      action: {
        label: 'View Pulse',
        onClick: () => window.location.href = '/pulse',
      },
    });
    setPendingPinMessage(null);
  };

  // Listing Flow Handlers
  const handleFileSelect = useCallback(async (file: File) => {
    setListingMode('processing');
    setIsProcessingDocument(true);
    
    try {
      const extractedData = await mockExtractDocument(file.name);
      setPendingExtraction(extractedData);
    } catch (error) {
      toast.error('Error processing document. Please try again.');
      setListingMode('idle');
    }
  }, [setListingMode, setPendingExtraction]);

  const handleProcessingComplete = useCallback(() => {
    setIsProcessingDocument(false);
    setListingMode('ready');
  }, [setListingMode]);

  const handleViewFullExtraction = useCallback(() => {
    setListingMode('verifying');
    navigate('/transactions/new-listing', {
      state: {
        extraction: pendingExtraction,
      },
    });
  }, [setListingMode, navigate, pendingExtraction]);

  const handleCancelListingFlow = useCallback(() => {
    setListingMode('idle');
    setPendingExtraction(null);
    setIsProcessingDocument(false);
    setBatchUploadState(null);
  }, [setListingMode, setPendingExtraction, setBatchUploadState]);

  // Batch processing handlers
  const handleBatchSelect = useCallback(async (files: File[]) => {
    startBatchFlow(files);
  }, [startBatchFlow]);

  const handleBatchProcessingComplete = useCallback(async (finalDocuments: ClassifiedDocument[]) => {
    if (!finalDocuments || finalDocuments.length === 0) {
      setListingMode('batch_ready');
      return;
    }

    // Ensure we always have a "primary" doc so the primary edit flow works like single upload
    const hasPrimary = finalDocuments.some((d) => d.classification.tier === 'primary');
    const normalizedDocuments: ClassifiedDocument[] = hasPrimary
      ? finalDocuments
      : finalDocuments.map((doc, idx) =>
          idx === 0
            ? {
                ...doc,
                classification: {
                  ...doc.classification,
                  tier: 'primary' as const,
                },
              }
            : doc
        );

    const primaryDoc =
      normalizedDocuments.find((d) => d.classification.tier === 'primary') ?? normalizedDocuments[0];

    try {
      const extractedData = await mockExtractDocument(primaryDoc.file.name);
      setPendingExtraction(extractedData);
    } catch (error) {
      console.error('Error extracting primary document:', error);
    }

    // Update the batch state with final documents
    updateBatchDocuments(normalizedDocuments);
    setListingMode('batch_ready');
  }, [setListingMode, setPendingExtraction, updateBatchDocuments]);

  const handleUpdateBatchDocuments = useCallback((updatedDocs: ClassifiedDocument[]) => {
    updateBatchDocuments(updatedDocs);
  }, [updateBatchDocuments]);

  // Contract Flow Handlers
  const [isProcessingContract, setIsProcessingContract] = useState(false);

  const handleContractFileSelect = useCallback(async (file: File) => {
    setContractMode('processing');
    setIsProcessingContract(true);
    
    try {
      // Extract contract data - we'll match to a listing after extraction
      const mockListing = activeListingForContract || listings[0];
      const extractedData = await mockExtractContract(file.name, mockListing);
      setPendingContract(extractedData);
    } catch (error) {
      toast.error('Error processing contract. Please try again.');
      setContractMode('idle');
    }
  }, [activeListingForContract, listings, setContractMode, setPendingContract]);

  // Contract batch handler - classifies and processes multiple contract documents
  const handleContractBatchSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    // Import classification dynamically
    const { classifyContractBatch } = await import('@/lib/mockContractClassification');
    const { documents, primaryIndex, hasPurchaseAgreement } = classifyContractBatch(files);
    
    // For now, process the primary file (purchase agreement) for extraction
    const primaryFile = files[primaryIndex];
    
    // Show toast with classification results
    if (files.length > 1) {
      const addendaCount = documents.filter(d => d.classification.tier === 'addenda').length;
      const disclosureCount = documents.filter(d => d.classification.tier === 'disclosure').length;
      
      toast.success(
        `Classified ${files.length} documents: ${hasPurchaseAgreement ? '1 Purchase Agreement' : 'No primary found'}${addendaCount > 0 ? `, ${addendaCount} addenda` : ''}${disclosureCount > 0 ? `, ${disclosureCount} disclosures` : ''}`
      );
    }
    
    // Process the primary document
    handleContractFileSelect(primaryFile);
  }, [handleContractFileSelect]);

  const handleContractProcessingComplete = useCallback(() => {
    setIsProcessingContract(false);
    
    // If we already have a listing selected, go straight to ready
    if (activeListingForContract) {
      setContractMode('ready');
      return;
    }
    
    // Try to auto-match the extracted property address to an active listing
    const extractedAddress = pendingContract?.propertyAddress?.toLowerCase() || '';
    const activeListings = listings.filter(l => l.status === 'active' || l.status === 'pending_review');
    
    const matchingListings = activeListings.filter(l => {
      const listingAddr = l.extraction.propertyAddress.toLowerCase();
      return extractedAddress.includes(listingAddr) || listingAddr.includes(extractedAddress.split(',')[0]);
    });
    
    if (matchingListings.length === 1) {
      // Exact match found - auto-select and proceed
      setActiveListingForContract(matchingListings[0]);
      setContractMode('ready');
    } else {
      // No match or multiple matches - ask user to select
      setContractMode('selecting_listing');
    }
  }, [activeListingForContract, pendingContract, listings, setContractMode, setActiveListingForContract]);

  const handleViewContractExtraction = useCallback(() => {
    if (!activeListingForContract) return;
    setContractMode('verifying');
    navigate(`/transactions/${activeListingForContract.id}/contract`);
  }, [setContractMode, activeListingForContract, navigate]);

  const handleStartManualIntake = useCallback(() => {
    setContractMode('manual_intake');
    setManualIntakeStep(1);
  }, [setContractMode, setManualIntakeStep]);

  const handleManualIntakeComplete = useCallback((data: Partial<ContractExtraction>) => {
    if (!activeListingForContract) return;
    
    const listing = activeListingForContract;
    const salesPrice = data.salesPrice || listing.extraction.listingPrice;
    const financing = salesPrice * 0.80;
    const cashPortion = salesPrice - financing;
    
    const fullContract: ContractExtraction = {
      id: `contract-${Date.now()}`,
      sourceListingId: listing.id,
      // Required fields
      sellers: listing.extraction.sellers,
      buyers: data.buyers || [],
      propertyAddress: `${listing.extraction.propertyAddress}, ${listing.extraction.city}, ${listing.extraction.state} ${listing.extraction.zipCode}`,
      cashPortion,
      financing,
      salesPrice,
      earnestMoney: data.earnestMoney || 5000,
      optionFee: data.optionFee || 500,
      optionPeriodDays: data.optionPeriodDays || 10,
      closingDate: data.closingDate || new Date(),
      effectiveDate: data.effectiveDate || new Date(),
      // Optional fields
      buyingAgent: data.buyingAgent,
      buyingBrokerage: data.buyingBrokerage,
      titleCompany: data.titleCompany,
      escrowOfficer: data.escrowOfficer,
      referrals: data.referrals,
      confidence: data.confidence || {},
    };
    
    setPendingContract(fullContract);
    setContractMode('ready');
  }, [activeListingForContract, setPendingContract, setContractMode]);

  const handleCancelContractFlow = useCallback(() => {
    setContractMode('idle');
    setPendingContract(null);
    setActiveListingForContract(null);
    setIsProcessingContract(false);
  }, [setContractMode, setPendingContract, setActiveListingForContract]);

  // Persist minimized state
  useEffect(() => {
    localStorage.setItem('mira-minimized', String(isMinimized));
  }, [isMinimized]);

  const handleRestoreFromMinimized = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  }, []);

  return (
    <>
      {/* Minimized Floating Button */}
      {isMinimized && !isExpanded && (
        <button
          onClick={handleRestoreFromMinimized}
          className={cn(
            "fixed z-50 w-12 h-12 rounded-full gradient-primary flex items-center justify-center",
            "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
            "hover:scale-110 transition-all duration-300 animate-scale-in",
            "group",
            isMobile 
              ? "bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4" 
              : "bottom-6 right-6"
          )}
          title="Open Mira"
        >
          <Sparkles className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
          {/* Subtle pulse ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
        </button>
      )}

      {/* Floating Input Bar */}
      {!isExpanded && !isMinimized && (
        <div className={cn(
          "fixed left-1/2 -translate-x-1/2 w-full px-4 z-50 transition-all duration-500 ease-out",
          isMobile 
            ? "bottom-[calc(5rem+env(safe-area-inset-bottom))] max-w-full" 
            : "bottom-6 max-w-2xl"
        )}>
          {/* Suggestion Chips */}
          {!isMobile && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {getMiraSuggestions(location.pathname).map((query, index) => (
                <button
                  key={query}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    setTimeout(() => handleSubmit(query), 100);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary/60 backdrop-blur-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {query}
                </button>
              ))}
            </div>
          )}
          
          {/* Input bar container with floating minimize button */}
          <div className="relative">
            {/* Floating minimize button - top right */}
            <button
              onClick={handleMinimize}
              className="absolute -top-8 right-2 w-6 h-6 rounded-full bg-muted/80 hover:bg-muted backdrop-blur-sm
                         flex items-center justify-center text-muted-foreground hover:text-foreground
                         transition-all duration-200 opacity-60 hover:opacity-100 z-10"
              title="Minimize Mira"
            >
              <X className="w-3 h-3" />
            </button>
            
            <div 
              className="glass-chat rounded-2xl p-2 cursor-pointer group hover:scale-[1.01] transition-all duration-300"
              onClick={() => setIsExpanded(true)}
            >
              {/* Subtle glow behind bar */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25 animate-float">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-muted-foreground flex-1 text-sm sm:text-base truncate">
                  {getMiraPlaceholder(location.pathname, isMobile)}
                </span>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 transition-all duration-200",
                      isListening && "text-destructive animate-pulse scale-110"
                    )}
                    onClick={(e) => { e.stopPropagation(); toggleVoiceInput(); }}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-8 w-8 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Chat Panel */}
      {isExpanded && (
        <div 
          className={cn(
            'fixed z-40 glass-chat transition-all duration-500 ease-out animate-scale-in overflow-hidden',
            isFullscreen 
              ? 'inset-0 rounded-none' 
              : isMobile
                ? 'left-0 right-0 top-14 bottom-[calc(4rem+env(safe-area-inset-bottom))] rounded-none'
                : 'bottom-6 right-6 w-[480px] h-[600px] rounded-2xl'
          )}
        >
          {/* Background gradient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-t from-primary/5 to-transparent blur-2xl" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mira</h3>
                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  autoSpeak && "text-primary bg-primary/10 scale-105"
                )}
                onClick={() => setAutoSpeak(!autoSpeak)}
                title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:scale-105 transition-transform duration-200"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:scale-105 hover:text-destructive transition-all duration-200"
                onClick={() => {
                  setIsChatOpen(false);
                  setIsExpanded(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-4 pb-16 space-y-4 h-[calc(100%-140px)] scrollbar-hide">
            {/* Always render chat history when it exists */}
            {chatHistory.length > 0 && (
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onPin={() => {
                      setPendingPinMessage(message);
                      setPinModalOpen(true);
                    }}
                    onSpeak={() => toggleSpeak(message.content, message.id)}
                    isSpeaking={isSpeaking && currentMessageId === message.id}
                    isPinnable={message.isPinnable}
                    animationDelay={index * 50}
                    onQueryClick={handleSubmit}
                  />
                ))}
              </div>
            )}

            {/* Welcome screen only when no messages and no active flow */}
            {chatHistory.length === 0 && listingMode === 'idle' && contractMode === 'idle' && (
              <div className="text-center py-8 animate-fade-in">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {/* Glow behind avatar */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
                  <div className="relative w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-xl shadow-primary/30">
                    <Sparkles className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Hi, I'm Mira</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  I can help you understand your business data. Try asking:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getMiraSuggestions(location.pathname).map((query, index) => (
                    <button
                      key={query}
                      onClick={() => handleSubmit(query)}
                      className="text-sm px-4 py-2 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Listing Flow UI */}
            {listingMode !== 'idle' && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                {/* Mira's conversational message */}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    {listingMode === 'uploading' && (
                      <p className="text-sm text-foreground">
                        Ready to start? 📄 Drop all your documents at once—Listing Agreement, disclosures, anything you have—and I'll sort and process them automatically.
                      </p>
                    )}
                    {listingMode === 'processing' && (
                      <p className="text-sm text-foreground">
                        Got it! I'm scanning the document now—extracting property details, seller info, and checking for signatures... ✨
                      </p>
                    )}
                    {listingMode === 'ready' && pendingExtraction && (
                      <div className="text-sm text-foreground space-y-2">
                        <p>✅ <span className="font-medium">100% Compliant</span>—All signatures and initials detected.</p>
                        <p>Here's what I extracted. <span className="font-medium">Tap "View & Edit"</span> to review the full details and send for compliance review.</p>
                      </div>
                    )}
                    {listingMode === 'batch_processing' && batchUploadState && (
                      <p className="text-sm text-foreground">
                        Processing {batchUploadState.documents.length} documents... I'll classify each one and extract key data. ✨
                      </p>
                    )}
                    {listingMode === 'batch_ready' && batchUploadState && (
                      <div className="text-sm text-foreground space-y-2">
                        <p>✅ All documents processed!</p>
                        <p>Review the primary document and supporting files below, then attach them to your checklist.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content for each stage */}
                {listingMode === 'uploading' && (
                  <div className="w-full space-y-4 pl-11">
                    <DocumentDropzone 
                      onFileSelect={handleFileSelect}
                      onBatchSelect={handleBatchSelect}
                      disabled={isProcessingDocument}
                      documentType="listing"
                      allowMultiple={true}
                    />
                    <div className="flex justify-start">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleCancelListingFlow}
                        className="text-muted-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {listingMode === 'processing' && (
                  <div className="w-full pl-11">
                    <UnifiedProcessingStatus 
                      isProcessing={true} 
                      onComplete={handleProcessingComplete}
                      variant="listing"
                    />
                  </div>
                )}

                {listingMode === 'ready' && pendingExtraction && (
                  <div className="w-full space-y-4 pl-11">
                    <UnifiedExtractionSummary 
                      type="listing"
                      extraction={pendingExtraction}
                      onViewFullExtraction={handleViewFullExtraction}
                    />
                    <div className="flex justify-start">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleCancelListingFlow}
                        className="text-muted-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {listingMode === 'batch_processing' && batchUploadState && (
                  <div className="w-full pl-11">
                    <BatchProcessingStatus 
                      documents={batchUploadState.documents}
                      currentIndex={batchUploadState.currentIndex}
                      onComplete={handleBatchProcessingComplete}
                      onUpdateDocuments={handleUpdateBatchDocuments}
                    />
                  </div>
                )}

                {listingMode === 'batch_ready' && batchUploadState && (
                  <div className="w-full space-y-4 pl-11">
                    <BatchExtractionSummary
                      documents={batchUploadState.documents}
                      primaryExtraction={pendingExtraction}
                      onViewPrimary={handleViewFullExtraction}
                      onApproveDocument={(docId) => updateBatchApproval(docId, 'approved')}
                      onRejectDocument={(docId) => updateBatchApproval(docId, 'rejected')}
                      onAttachAll={attachBatchToChecklist}
                      onReviewIndividually={() => {
                        // For now, navigate to first document that needs review
                        handleViewFullExtraction();
                      }}
                      approvalState={batchUploadState.approvalState}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancelListingFlow}
                      className="text-muted-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Submitted state - post-submission conversation */}
                {listingMode === 'submitted' && submittedListing && (
                  <div className="w-full space-y-4">
                    {/* Mira's confirmation message */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                        <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                        <div className="text-sm text-foreground space-y-3">
                          <p>🎉 <span className="font-medium">Listing Created!</span> Now being reviewed by compliance.</p>
                          <p className="text-muted-foreground">Your listing for <span className="font-medium">{submittedListing.extraction.propertyAddress}</span> is ready. View the property overview to track progress and manage your listing:</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="pl-11 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-3 h-auto py-3"
                        onClick={() => {
                          const listingId = submittedListing?.id || 'demo';
                          setSubmittedListing(null);
                          setListingMode('idle');
                          setIsExpanded(false);
                          navigate(`/transactions/${listingId}`);
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">🏠</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">View Property Overview</div>
                          <div className="text-xs text-muted-foreground">See listing details and track progress</div>
                        </div>
                      </Button>
                      
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contract Upload Flow - Upload First (when no listing selected yet) */}
            {contractMode === 'uploading' && !activeListingForContract && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                {/* Mira's message */}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground">
                      Let's create a transaction! 🎉 Drop your executed contract and any supporting documents below—I'll extract all the details.
                    </p>
                  </div>
                </div>
                
                {/* Document Upload */}
                <div className="w-full space-y-4 pl-11">
                  <DocumentDropzone 
                    onFileSelect={handleContractFileSelect}
                    onBatchSelect={handleContractBatchSelect}
                    disabled={isProcessingContract}
                    documentType="contract"
                    allowMultiple={true}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setContractMode('idle')}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Contract Processing - extracting data */}
            {contractMode === 'processing' && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground">
                      Got it! I'm scanning the contract—extracting buyer info, financials, and key dates... ✨
                    </p>
                  </div>
                </div>
                <div className="w-full pl-11">
                  <UnifiedProcessingStatus 
                    isProcessing={true} 
                    onComplete={handleContractProcessingComplete}
                    variant="contract"
                  />
                </div>
              </div>
            )}

            {/* Listing Selection - after extraction if no auto-match */}
            {contractMode === 'selecting_listing' && pendingContract && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                {/* Mira's message */}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground">
                      Got it! I extracted the contract for <span className="font-medium">{pendingContract.propertyAddress}</span>. Which listing does this belong to?
                    </p>
                  </div>
                </div>
                
                {/* Listing Selection */}
                <div className="w-full space-y-3 pl-11">
                  {listings.filter(l => l.status === 'active' || l.status === 'pending_review').length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No active listings found. Create a listing first, then come back to add this contract.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setContractMode('idle');
                          setPendingContract(null);
                          startListingFlow();
                        }}
                      >
                        Create Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-secondary/50 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground">Select a listing</p>
                      </div>
                      <div className="divide-y divide-border max-h-64 overflow-y-auto">
                        {listings
                          .filter(l => l.status === 'active' || l.status === 'pending_review')
                          .map((listing) => (
                            <button
                              key={listing.id}
                              onClick={() => {
                                setActiveListingForContract(listing);
                                setContractMode('ready');
                              }}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
                            >
                              <div>
                                <p className="font-medium text-foreground text-sm">
                                  {listing.extraction.propertyAddress}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {listing.extraction.city}, {listing.extraction.state} • {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.extraction.listingPrice)}
                                </p>
                              </div>
                              <div className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                                {listing.status === 'active' ? 'Active' : 'Pending Review'}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancelContractFlow}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Contract Ready State - after listing is selected */}
            {contractMode === 'ready' && activeListingForContract && pendingContract && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <div className="text-sm text-foreground space-y-2">
                      <p className="text-success font-medium">✅ 100% Compliant—All fields extracted, signatures and initials verified.</p>
                      <p>Tap <span className="font-medium">"View & Edit"</span> to review the details and complete any fields not provided in the contract.</p>
                    </div>
                  </div>
                </div>
                <div className="w-full pl-11">
                  <UnifiedExtractionSummary 
                    type="contract"
                    extraction={pendingContract}
                    onViewFullExtraction={handleViewContractExtraction}
                  />
                </div>
              </div>
            )}

            {/* Contract Upload when listing is already selected (from property detail) */}
            {contractMode === 'uploading' && activeListingForContract && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground">
                      Exciting news! 🎉 Let's get <span className="font-medium">{activeListingForContract.extraction.propertyAddress}</span> under contract. Drop your sales contract and/or any supporting docs below.
                    </p>
                  </div>
                </div>
                <div className="w-full pl-11">
                  <DocumentDropzone 
                    onFileSelect={handleContractFileSelect}
                    onBatchSelect={handleContractBatchSelect}
                    disabled={isProcessingContract}
                    documentType="contract"
                    allowMultiple={true}
                  />
                </div>
              </div>
            )}

            {/* Manual Intake Flow */}
            {contractMode === 'manual_intake' && activeListingForContract && (
              <div className="flex flex-col py-4 animate-fade-in space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-foreground">
                      No problem! Let me guide you through the contract details step by step. 📝
                    </p>
                  </div>
                </div>
                <div className="w-full pl-11">
                  <ManualIntakeFlow
                    listing={activeListingForContract}
                    onComplete={handleManualIntakeComplete}
                    onCancel={handleCancelContractFlow}
                  />
                </div>
              </div>
            )}

            {/* Contract Submitted state - post-approval conversation */}
            {contractMode === 'submitted' && submittedContract && (
              <div className="w-full space-y-4">
                {/* Mira's confirmation message */}
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                    <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <div className="text-sm text-foreground space-y-3">
                      <p>🎉 <span className="font-medium">Transaction Created!</span> Now being reviewed by compliance.</p>
                      <p className="text-muted-foreground">Your transaction checklist is ready. View the property overview to track progress and manage upcoming deadlines:</p>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="pl-11 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-auto py-3"
                    onClick={() => {
                      const listingId = submittedContract?.listing.id || 'demo';
                      setSubmittedContract(null);
                      setContractMode('idle');
                      setIsExpanded(false);
                      navigate(`/transactions/${listingId}`);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">View Property Overview</div>
                      <div className="text-xs text-muted-foreground">Track progress and manage deadlines</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {/* Pin Modal */}
            <PinInsightModal
              open={pinModalOpen}
              onOpenChange={setPinModalOpen}
              insightTitle={pendingPinMessage?.visualizations?.[0]?.title || 'Insight'}
              onConfirm={handleConfirmPin}
            />

            {isTyping && (
              <div className="flex items-center gap-3 chat-bubble-assistant">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                  <div className="relative w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <div className="bg-secondary/80 rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing" style={{ animationDelay: '200ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-typing" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              className="flex items-center gap-2"
            >
              <div className="flex-1 input-glow bg-secondary/60 rounded-xl overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getMiraPlaceholder(location.pathname, false)}
                  className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-10 w-10 transition-all duration-200",
                  isListening && "text-destructive animate-pulse scale-110 bg-destructive/10"
                )}
                onClick={toggleVoiceInput}
                type="button"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function renderVisualization(viz: Visualization, onPin: () => void) {
  switch (viz.type) {
    case 'line':
    case 'bar':
    case 'pie':
    case 'area':
      return <ChartCard visualization={viz} onPin={onPin} compact />;
    case 'table':
      return (
        <DataTable 
          title={viz.title} 
          columns={viz.columns || []} 
          data={viz.data} 
          onPin={onPin}
          maxRows={5}
        />
      );
    case 'list':
      return (
        <ListCard 
          title={viz.title} 
          items={viz.data} 
          onPin={onPin}
          maxItems={4}
        />
      );
    case 'metric':
      return (
        <MetricCard 
          title={viz.title}
          value={viz.data.value}
          change={viz.data.change}
          changeLabel={viz.data.changeLabel}
          onPin={onPin}
          size="sm"
        />
      );
    default:
      return null;
  }
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀'];

interface MessageBubbleProps {
  message: ChatMessage;
  onPin: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  isPinnable?: boolean;
  animationDelay?: number;
  onQueryClick?: (query: string) => void;
}

function MessageBubble({ 
  message, 
  onPin, 
  onSpeak, 
  isSpeaking,
  isPinnable,
  animationDelay = 0,
  onQueryClick
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [reactions, setReactions] = useState<string[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const toggleReaction = (emoji: string) => {
    setReactions(prev => 
      prev.includes(emoji) 
        ? prev.filter(r => r !== emoji)
        : [...prev, emoji]
    );
    setShowReactionPicker(false);
  };

  // Check if this is a rich response (has summary, keyPoints, or relatedQueries)
  const isRichResponse = !isUser && (message.summary || message.keyPoints?.length || message.relatedQueries?.length);

  return (
    <div 
      className={cn(
        'flex gap-3 group',
        isUser ? 'flex-row-reverse chat-bubble-user' : 'chat-bubble-assistant'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-110',
        isUser 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'gradient-primary shadow-lg shadow-primary/20',
        !isUser && 'self-start mt-1'
      )}>
        {isUser ? 'C' : <Sparkles className="w-4 h-4 text-primary-foreground" />}
      </div>
      
      <div className={cn('flex-1 space-y-2', isUser && 'text-right')}>
        {/* Rich Response using IntelligentResponse */}
        {isRichResponse ? (
          <div className="space-y-2">
            <IntelligentResponse 
              message={message} 
              onPin={isPinnable ? onPin : undefined}
              onQueryClick={onQueryClick}
            />
            
            {/* Action buttons for rich response */}
            <div className={cn(
              "flex items-center gap-1 transition-opacity duration-200",
              showReactionPicker ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-secondary/80 transition-all duration-200"
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                >
                  <SmilePlus className="w-3.5 h-3.5" />
                </Button>
                
                {showReactionPicker && (
                  <div className="absolute bottom-full mb-1 left-0 bg-card/95 backdrop-blur-md rounded-xl px-2 py-1.5 border border-border/50 shadow-lg flex gap-1 animate-scale-in z-10">
                    {REACTION_EMOJIS.map((emoji, i) => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(emoji)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:bg-secondary/80 hover:scale-110 transition-all duration-150",
                          reactions.includes(emoji) && "bg-primary/20"
                        )}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 opacity-60 hover:opacity-100 transition-all duration-200",
                  isSpeaking && "text-primary opacity-100 scale-105"
                )}
                onClick={onSpeak}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        ) : (
          /* Standard message bubble for user messages and simple responses */
          <>
            <div className={cn("inline-flex flex-col gap-1 relative", isUser ? "items-end" : "items-start")}>
              <div className={cn(
                'inline-block rounded-2xl px-4 py-2.5 text-sm transition-all duration-200 relative',
                isUser 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
              )}>
                {message.content}
                
                {/* Reactions display */}
                {reactions.length > 0 && (
                  <div className={cn(
                    "absolute -bottom-3 flex gap-0.5 bg-card/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-border/50 shadow-sm",
                    isUser ? "right-2" : "left-2"
                  )}>
                    {reactions.map((emoji, i) => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(emoji)}
                        className="text-sm hover:scale-125 transition-transform duration-150 animate-scale-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action buttons row */}
              <div className={cn(
                "flex items-center gap-1 transition-opacity duration-200",
                showReactionPicker ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {/* Reaction picker trigger */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-secondary/80 transition-all duration-200"
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                  >
                    <SmilePlus className="w-3.5 h-3.5" />
                  </Button>
                  
                  {/* Reaction picker popup */}
                  {showReactionPicker && (
                    <div className={cn(
                      "absolute bottom-full mb-1 bg-card/95 backdrop-blur-md rounded-xl px-2 py-1.5 border border-border/50 shadow-lg flex gap-1 animate-scale-in z-10",
                      isUser ? "right-0" : "left-0"
                    )}>
                      {REACTION_EMOJIS.map((emoji, i) => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(emoji)}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:bg-secondary/80 hover:scale-110 transition-all duration-150",
                            reactions.includes(emoji) && "bg-primary/20"
                          )}
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {!isUser && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7 opacity-60 hover:opacity-100 transition-all duration-200",
                        isSpeaking && "text-primary opacity-100 scale-105"
                      )}
                      onClick={onSpeak}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </Button>
                    
                    {isPinnable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200"
                        onClick={onPin}
                        title="Pin to Pulse"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Legacy visualizations for non-rich responses */}
            {message.visualizations?.map((viz, i) => (
              <div key={i} className="mt-2 animate-fade-in" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                {renderVisualization(viz, onPin)}
              </div>
            ))}

            {message.sources && message.sources.length > 0 && !isRichResponse && (
              <div className="text-xs text-muted-foreground/80 mt-2 animate-fade-in">
                Sources: {message.sources.join(', ')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function generateMockResponse(query: string, currentPage: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('gci') || lowerQuery.includes('down')) {
    return {
      role: 'assistant',
      content: "Based on your production data, your GCI is down 12% this month compared to last month. This appears to be primarily due to 2 pending transactions that slipped from their expected closing dates.",
      summary: "Your GCI is down 12% — 2 transactions slipped from their expected closing dates",
      visualizations: [{
        type: 'area',
        title: 'GCI Trend (Last 6 Months)',
        data: [
          { label: 'Jul', value: 42000 },
          { label: 'Aug', value: 45000 },
          { label: 'Sep', value: 38000 },
          { label: 'Oct', value: 52000 },
          { label: 'Nov', value: 48000 },
          { label: 'Dec', value: 42000 },
        ]
      }],
      keyPoints: [
        { icon: 'decrease', text: 'Transaction volume: 8 deals vs 12 last month' },
        { icon: 'decrease', text: 'Average deal size: $385K vs $425K last month' },
        { icon: 'warning', text: 'Market activity in your area is down 8%' },
      ],
      relatedQueries: ['Which deals slipped?', 'Compare to last year', 'Show by agent'],
      sources: ['YTD Income Report', 'Transaction History'],
      isPinnable: true,
      visualizationLayout: 'single',
    };
  }

  if (lowerQuery.includes('risk') || lowerQuery.includes('leaving') || lowerQuery.includes('churn')) {
    return {
      role: 'assistant',
      content: "I've identified 3 agents who may be at risk of disengagement based on their recent activity patterns:",
      summary: "3 agents showing disengagement signals — action recommended",
      visualizations: [{
        type: 'list',
        title: 'At-Risk Agents',
        data: [
          { id: '1', title: 'Sarah Johnson', subtitle: 'Last active 14 days ago', status: 'high', value: 0 },
          { id: '2', title: 'Mike Chen', subtitle: 'Transaction volume down 45%', status: 'high', value: 12500 },
          { id: '3', title: 'Lisa Park', subtitle: 'Missed 3 team meetings', status: 'medium', value: 28000 },
        ]
      }],
      keyPoints: [
        { icon: 'warning', text: 'Sarah Johnson has not logged in for 14 days' },
        { icon: 'warning', text: "Mike Chen's production is down 45% from Q3" },
        { icon: 'insight', text: 'All 3 agents are within their first year' },
      ],
      relatedQueries: ['Schedule check-ins', 'View full agent activity', 'Compare to industry benchmarks'],
      sources: ['Agent Activity Log', 'Engagement Metrics'],
      isPinnable: true,
    };
  }

  if (lowerQuery.includes('cap')) {
    return {
      role: 'assistant',
      content: "You're 73% of the way to your cap! At your current pace, you should reach cap by mid-February.",
      summary: "73% to cap — on track to reach it by mid-February",
      visualizations: [{
        type: 'metric',
        title: 'Cap Progress',
        data: { value: '$14,600', change: 12, changeLabel: 'of $20,000 cap' }
      }],
      keyPoints: [
        { icon: 'success', text: '$14,600 earned toward $20,000 cap' },
        { icon: 'increase', text: 'Trending 15% ahead of last year at this point' },
        { icon: 'insight', text: 'Estimated cap date: February 15, 2024' },
      ],
      relatedQueries: ['What happens after cap?', 'Show cap history', 'Compare team caps'],
      sources: ['Cap Progress Report'],
      isPinnable: true,
    };
  }

  if (lowerQuery.includes('team') || lowerQuery.includes('performer')) {
    return {
      role: 'assistant',
      content: "Here's a comparison of your team's top performers this quarter:",
      summary: "Sarah J. leads the team at $68K GCI — 27% ahead of #2",
      visualizations: [{
        type: 'bar',
        title: 'Team GCI Comparison (Q4)',
        data: [
          { label: 'Sarah J.', value: 68000 },
          { label: 'Mike C.', value: 54000 },
          { label: 'Lisa P.', value: 47000 },
          { label: 'John D.', value: 42000 },
          { label: 'Amy R.', value: 38000 },
        ]
      }],
      keyPoints: [
        { icon: 'success', text: 'Sarah J. is 27% ahead of the next performer' },
        { icon: 'increase', text: 'Team average is up 8% from Q3' },
        { icon: 'insight', text: 'Top 3 represent 68% of total team production' },
      ],
      relatedQueries: ['What makes Sarah successful?', 'Help underperformers', 'Set team goals'],
      sources: ['Team Performance Dashboard'],
      isPinnable: true,
    };
  }

  if (lowerQuery.includes('transaction') || lowerQuery.includes('deal')) {
    return {
      role: 'assistant',
      content: "Here are your recent transactions with their current status:",
      summary: "4 active transactions totaling $1.6M — 1 at risk of falling through",
      visualizations: [{
        type: 'table',
        title: 'Recent Transactions',
        columns: [
          { key: 'property', label: 'Property', sortable: true },
          { key: 'value', label: 'Value', type: 'currency' as const, sortable: true },
          { key: 'status', label: 'Status', type: 'status' as const },
          { key: 'closingDate', label: 'Closing', type: 'date' as const, sortable: true },
        ],
        data: [
          { property: '123 Oak Street', value: 450000, status: 'pending', closingDate: '2024-01-15' },
          { property: '456 Maple Ave', value: 380000, status: 'closed', closingDate: '2024-01-02' },
          { property: '789 Pine Road', value: 525000, status: 'pending', closingDate: '2024-01-22' },
          { property: '321 Cedar Lane', value: 290000, status: 'at_risk', closingDate: '2024-01-28' },
        ]
      }],
      keyPoints: [
        { icon: 'warning', text: '321 Cedar Lane has inspection contingency issues' },
        { icon: 'success', text: '456 Maple Ave closed on schedule' },
        { icon: 'insight', text: '$975K in pending closings this month' },
      ],
      relatedQueries: ['Fix at-risk deal', 'Pipeline forecast', 'Show commission breakdown'],
      sources: ['Transaction Management System'],
      isPinnable: true,
    };
  }

  if (lowerQuery.includes('breakdown') || lowerQuery.includes('distribution') || lowerQuery.includes('split')) {
    return {
      role: 'assistant',
      content: "Here's the breakdown of your income sources this quarter:",
      summary: "Listing commissions drive 46% of your income — diversification opportunity",
      visualizations: [{
        type: 'pie',
        title: 'Income Distribution (Q4)',
        data: [
          { label: 'Listing Commission', value: 45000 },
          { label: 'Buyer Commission', value: 32000 },
          { label: 'Referral Fees', value: 12000 },
          { label: 'Bonuses', value: 8000 },
        ]
      }],
      keyPoints: [
        { icon: 'insight', text: 'Listing commissions: 46% of total' },
        { icon: 'insight', text: 'Buyer commissions: 33% of total' },
        { icon: 'increase', text: 'Referral income up 25% from Q3' },
      ],
      relatedQueries: ['Grow referral income', 'Compare to top agents', 'Set income goals'],
      sources: ['Financial Reports'],
      isPinnable: true,
    };
  }

  return {
    role: 'assistant',
    content: `I understand you're asking about "${query}". Based on your ${currentPage} data, I can help analyze this. Would you like me to create a detailed report or visualization?`,
    relatedQueries: ['Show my GCI trend', 'Who needs attention?', 'Pipeline summary'],
    isPinnable: false,
  };
}
