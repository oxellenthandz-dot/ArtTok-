import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { CommentItem } from '../types';

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  postTitle?: string;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<CommentItem[]>(comments);

  // Sync if comments prop changes
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `my-c-${Date.now()}`,
      authorName: 'Toi (Artiste)',
      authorHandle: 'toi_artiste',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorAge: 'Ado Artiste',
      text: commentText.trim(),
      likesCount: 0,
      timeAgo: 'À l\'instant',
      isLiked: false,
    };

    setLocalComments([newComment, ...localComments]);
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleToggleLike = (commentId: string) => {
    setLocalComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
          };
        }
        return c;
      })
    );
  };

  const addEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-[68vh] bg-[#161823] rounded-t-3xl flex flex-col shadow-2xl border-t border-neutral-800 text-white overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative py-3.5 px-4 border-b border-neutral-800/80 flex items-center justify-center">
          <span className="text-sm font-bold tracking-wide">
            {localComments.length} commentaire{localComments.length > 1 ? 's' : ''}
          </span>
          <button
            id="btn-close-comments"
            onClick={onClose}
            className="absolute right-4 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
          {localComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
              <span className="text-3xl">🎨</span>
              <p className="text-sm font-medium">Sois le premier artiste à commenter !</p>
            </div>
          ) : (
            localComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 group">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-neutral-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-neutral-300">
                      {comment.authorName}
                    </span>
                    {comment.authorAge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-[#25F4EE] font-medium border border-[#25F4EE]/20">
                        {comment.authorAge}
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-500">
                      • {comment.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-100 mt-1 break-words leading-relaxed font-normal">
                    {comment.text}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                    <button
                      onClick={() => setCommentText(`@${comment.authorHandle} `)}
                      className="hover:text-neutral-200 font-medium"
                    >
                      Répondre
                    </button>
                  </div>
                </div>

                {/* Comment Like button */}
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className="flex flex-col items-center pt-1 text-neutral-400 hover:text-white"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      comment.isLiked
                        ? 'fill-[#FE2C55] text-[#FE2C55]'
                        : 'text-neutral-400'
                    }`}
                  />
                  {comment.likesCount > 0 && (
                    <span className="text-[10px] mt-0.5 font-medium">
                      {comment.likesCount}
                    </span>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Emoji Bar */}
        <div className="px-4 py-1.5 bg-[#12131b] border-t border-neutral-800/60 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {['✨', '🔥', '🌸', '👏', '🎨', '💖', '✍️', '⚡'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-[#161823] border-t border-neutral-800 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-neutral-700">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Mon avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              id="input-comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Donne ton avis d'artiste bienveillant..."
              className="w-full bg-neutral-800/80 text-sm text-white placeholder-neutral-500 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FE2C55]/60 pr-10 border border-neutral-700/60"
            />
          </div>
          <button
            type="submit"
            id="btn-send-comment"
            disabled={!commentText.trim()}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              commentText.trim()
                ? 'bg-[#FE2C55] text-white hover:bg-[#e0264b]'
                : 'text-neutral-500 bg-neutral-800 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
