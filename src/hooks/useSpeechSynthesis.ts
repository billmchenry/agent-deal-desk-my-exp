import { useState, useCallback, useEffect, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback((text: string, messageId: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => 
        voice.name.includes('Samantha') || 
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentMessageId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentMessageId(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  const toggle = useCallback((text: string, messageId: string) => {
    if (isSpeaking && currentMessageId === messageId) {
      stop();
    } else {
      speak(text, messageId);
    }
  }, [isSpeaking, currentMessageId, speak, stop]);

  return {
    isSpeaking,
    currentMessageId,
    speak,
    stop,
    toggle,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
}
