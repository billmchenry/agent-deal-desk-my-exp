import { useState } from 'react';
import { MessageSquare, Send, MoreHorizontal, Reply, ThumbsUp, Paperclip, AtSign, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  mentions?: string[];
  attachments?: { name: string; type: string }[];
}

interface PropertyCommentsTabProps {
  listing: Listing;
}

// Mock comments data - conversation between TC and Agent
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      role: 'Transaction Coordinator',
    },
    content: 'Hi @Marcus! I\'ve reviewed the disclosure package and everything looks good. Just need the HOA docs to complete the file.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 1,
    isLiked: false,
    mentions: ['Marcus'],
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Marcus Johnson',
          role: 'Listing Agent',
        },
        content: 'Thanks Sarah! I\'ll reach out to the seller now and get those HOA documents sent over.',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        likes: 1,
        isLiked: false,
      },
      {
        id: '1-2',
        author: {
          name: 'Sarah Chen',
          role: 'Transaction Coordinator',
        },
        content: 'Perfect, let me know once you have them. I\'ll update the checklist.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        likes: 0,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Marcus Johnson',
      role: 'Listing Agent',
    },
    content: '@Sarah just got the HOA docs from the seller! Uploading them now.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 2,
    isLiked: true,
    mentions: ['Sarah'],
    attachments: [{ name: 'HOA_Documents.pdf', type: 'pdf' }],
    replies: [
      {
        id: '2-1',
        author: {
          name: 'Sarah Chen',
          role: 'Transaction Coordinator',
        },
        content: 'Got them! File is now complete. Ready for MLS submission whenever you are.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        likes: 1,
        isLiked: false,
      },
    ],
  },
  {
    id: '3',
    author: {
      name: 'Marcus Johnson',
      role: 'Listing Agent',
    },
    content: 'Great teamwork Sarah! Let\'s push it live. Can you confirm all signatures are in place?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 1,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        author: {
          name: 'Sarah Chen',
          role: 'Transaction Coordinator',
        },
        content: 'All signatures verified ✓ You\'re good to go!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        likes: 2,
        isLiked: true,
      },
    ],
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className={cn("group", isReply && "ml-10 mt-3")}>
      <div className="flex gap-3">
        <Avatar className={cn("flex-shrink-0", isReply ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground text-sm">
                {comment.author.name}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                {comment.author.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.timestamp)}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-foreground mt-1 leading-relaxed">
            {comment.content.split(' ').map((word, i) => {
              if (word.startsWith('@')) {
                return (
                  <span key={i} className="text-primary font-medium">
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </p>
          
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="flex gap-2 mt-2">
              {comment.attachments.map((attachment, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                >
                  <Paperclip className="w-3 h-3" />
                  {attachment.name}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-2">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ThumbsUp className={cn("w-3.5 h-3.5", liked && "fill-primary")} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            
            {!isReply && (
              <button 
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>
          
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm resize-none"
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" className="h-8" disabled={!replyText.trim()}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 text-xs"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 border-l-2 border-border pl-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PropertyCommentsTab({ listing }: PropertyCommentsTabProps) {
  const { currentAgent } = useApp();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `new-${Date.now()}`,
      author: {
        name: currentAgent.name,
        role: currentAgent.role || 'Agent',
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* New Comment Input */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 hidden sm:flex">
              <AvatarImage src={currentAgent.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(currentAgent.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Add a comment about this listing..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground px-2 sm:px-3">
                    <AtSign className="w-4 h-4" />
                    <span className="hidden xs:inline">Mention</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground px-2 sm:px-3">
                    <Paperclip className="w-4 h-4" />
                    <span className="hidden xs:inline">Attach</span>
                  </Button>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
              Comments
              <Badge variant="secondary" className="ml-1">
                {comments.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to add one!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
