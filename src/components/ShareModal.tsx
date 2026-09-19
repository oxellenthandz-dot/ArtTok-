import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MessageSquare,
  Download,
  Share2,
  Sparkles,
  Repeat2
} from 'lucide-react';
import { ArtVideoPost } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ArtVideoPost;
  onCollaborateShortcut?: () => void;
  onToggleRepost?: (postId: string) => void;
  onDirectMessage?: (post: ArtVideoPost) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  post,
  onCollaborateShortcut,
  onToggleRepost,
  onDirectMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [repostNotice, setRepostNotice] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRepost = () => {
    if (onToggleRepost) {
      onToggleRepost(post.id);
    }
    setRepostNotice(true);
    setTimeout(() => {
      setRepostNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#161823] rounded-t-3xl p-5 border-t border-neutral-800 text-white shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#25F4EE]" />
            <h3 className="font-bold text-base">Partager & Republier</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {repostNotice && (
          <div className="my-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold animate-in fade-in">
            {post.isReposted ? '✓ Vidéo republiée sur ton profil !' : 'Vidéo retirée de tes republications'}
          </div>
        )}

        {/* Art info summary */}
        <div className="flex items-center gap-3 my-3.5 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <img
            src={post.artworkPoster}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className="w-12 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {post.creatorName} (@{post.creatorHandle})
            </p>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              {post.caption}
            </p>
            <span className="text-[10px] text-[#FE2C55] font-medium">
              #{post.categoryName}
            </span>
          </div>
        </div>

        {/* Quick action grid with TikTok signature REPUBLIER button */}
        <div className="grid grid-cols-5 gap-2 text-center my-3">
          {/* 1. REPUBLIER (Iconic TikTok Repost) */}
          <button
            id="share-btn-repost"
            onClick={handleRepost}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-800/80 transition-transform active:scale-95 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                post.isReposted
                  ? 'bg-[#25F4EE] text-black'
                  : 'bg-gradient-to-tr from-[#25F4EE] to-emerald-400 text-black'
              }`}
            >
              <Repeat2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] text-neutral-300 font-bold">
              {post.isReposted ? 'Republié' : 'Republier'}
            </span>
          </button>

          {/* 2. Proposer Collab */}
          <button
            id="share-btn-collab"
            onClick={() => {
              onClose();
              onCollaborateShortcut?.();
            }}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-800/80 transition-transform active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#f43f5e] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">Collab</span>
          </button>

          {/* 3. Message Privé */}
          <button
            id="share-btn-message"
            onClick={() => {
              onClose();
              if (onDirectMessage) {
                onDirectMessage(post);
              }
            }}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-800/80 transition-transform active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">Message</span>
          </button>

          {/* 4. Copier le lien */}
          <button
            id="share-btn-copy"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-800/80 transition-transform active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:scale-110 transition-transform">
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">
              {copied ? 'Copié' : 'Lien'}
            </span>
          </button>

          {/* 5. Télécharger */}
          <button
            id="share-btn-download"
            onClick={() => {
              alert('Image de l\'artiste sauvegardée !');
              onClose();
            }}
            className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-neutral-800/80 transition-transform active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
