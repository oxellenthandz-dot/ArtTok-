import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Plus, Check, Repeat2 } from 'lucide-react';
import { ArtVideoPost } from '../types';

interface RightActionBarProps {
  post: ArtVideoPost;
  onLike: () => void;
  onBookmark: () => void;
  onFollow: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onRepost?: () => void;
  onSoundClick?: () => void;
  onOpenCreatorProfile?: () => void;
  isPlaying?: boolean;
}

export const RightActionBar: React.FC<RightActionBarProps> = ({
  post,
  onLike,
  onBookmark,
  onFollow,
  onOpenComments,
  onOpenShare,
  onRepost,
  onSoundClick,
  onOpenCreatorProfile,
  isPlaying = true,
}) => {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-5 text-white select-none">
      {/* Creator Profile Avatar with Follow (+) Button */}
      <div className="relative flex flex-col items-center">
        <button
          id={`btn-creator-avatar-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenCreatorProfile?.();
          }}
          className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#25F4EE] via-white to-[#FE2C55] shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title={`Voir le profil et le catalogue de @${post.creatorHandle}`}
        >
          <img
            src={post.creatorAvatar}
            alt={post.creatorName}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover border border-black/40"
          />
        </button>
        <button
          id={`btn-follow-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onFollow();
          }}
          title={post.isFollowing ? 'Abonné' : 'Suivre l\'artiste'}
          className={`absolute -bottom-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 active:scale-75 ${
            post.isFollowing
              ? 'bg-neutral-800 text-[#25F4EE] border border-white/20'
              : 'bg-[#FE2C55] text-white hover:scale-110'
          }`}
        >
          {post.isFollowing ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[3]" />
          )}
        </button>
      </div>

      {/* Like Button */}
      <div className="flex flex-col items-center">
        <button
          id={`btn-like-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="group relative flex items-center justify-center p-2 rounded-full transition-transform active:scale-75"
          aria-label="Aimer"
        >
          <Heart
            className={`w-9 h-9 transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
              post.isLiked
                ? 'fill-[#FE2C55] text-[#FE2C55] scale-110'
                : 'text-white/95 fill-black/20 group-hover:text-neutral-200'
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-white text-shadow-tiktok mt-[-2px]">
          {formatCount(post.likesCount)}
        </span>
      </div>

      {/* Comments Button */}
      <div className="flex flex-col items-center">
        <button
          id={`btn-comments-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="p-2 rounded-full transition-transform active:scale-75"
          aria-label="Commentaires"
        >
          <MessageCircle className="w-8 h-8 text-white fill-black/30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:scale-105" />
        </button>
        <span className="text-xs font-semibold text-white text-shadow-tiktok mt-[-2px]">
          {formatCount(post.commentsCount)}
        </span>
      </div>

      {/* Bookmark Button (Favoris) */}
      <div className="flex flex-col items-center">
        <button
          id={`btn-bookmark-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className="p-2 rounded-full transition-transform active:scale-75"
          aria-label="Mettre aux favoris"
          title={post.isBookmarked ? 'Retirer des favoris' : 'Mettre aux favoris'}
        >
          <Bookmark
            className={`w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all ${
              post.isBookmarked
                ? 'fill-[#FFB800] text-[#FFB800] scale-105'
                : 'text-white fill-black/30 hover:scale-105'
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-white text-shadow-tiktok mt-[-2px]">
          {formatCount(post.bookmarksCount)}
        </span>
      </div>

      {/* Republier (Repost) Button */}
      <div className="flex flex-col items-center">
        <button
          id={`btn-repost-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onRepost?.();
          }}
          className="p-2 rounded-full transition-transform active:scale-75 relative group"
          aria-label="Republier"
          title={post.isReposted ? 'Déjà republié sur ton profil (cliquer pour annuler)' : 'Republier sur ton profil'}
        >
          <Repeat2
            className={`w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all ${
              post.isReposted
                ? 'text-[#25F4EE] scale-115 drop-shadow-[0_0_10px_rgba(37,244,238,0.9)]'
                : 'text-white hover:text-[#25F4EE] hover:scale-105'
            }`}
          />
          {post.isReposted && (
            <span className="absolute 1 right-1 w-2.5 h-2.5 rounded-full bg-[#25F4EE] ring-2 ring-black" />
          )}
        </button>
        <span
          className={`text-xs font-semibold text-shadow-tiktok mt-[-2px] ${
            post.isReposted ? 'text-[#25F4EE] font-bold' : 'text-white'
          }`}
        >
          {formatCount(post.repostsCount || 0)}
        </span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center">
        <button
          id={`btn-share-${post.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare();
          }}
          className="p-2 rounded-full transition-transform active:scale-75"
          aria-label="Partager"
        >
          <Share2 className="w-8 h-8 text-white fill-black/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:scale-105" />
        </button>
        <span className="text-xs font-semibold text-white text-shadow-tiktok mt-[-2px]">
          {formatCount(post.sharesCount)}
        </span>
      </div>

      {/* Spinning Vinyl Disc with Floating Musical Notes */}
      <div
        className="relative mt-2 cursor-pointer flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onSoundClick?.();
        }}
        title={`Musique: ${post.soundTitle} - ${post.soundArtist}`}
      >
        {isPlaying && (
          <>
            <span className="absolute -top-3 -left-2 text-sm text-[#25F4EE] font-bold pointer-events-none animate-float-note-1">
              ♪
            </span>
            <span className="absolute -top-5 -left-3 text-base text-[#FE2C55] font-bold pointer-events-none animate-float-note-2">
              ♫
            </span>
          </>
        )}

        {/* Vinyl disk container */}
        <div
          className={`w-11 h-11 rounded-full bg-[#161823] border-[3px] border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at center, #262626 25%, #0d0d0d 30%, #262626 45%, #0d0d0d 50%, #1f1f1f 70%)',
          }}
        >
          <img
            src={post.soundCover}
            alt={post.soundTitle}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover border border-black/80"
          />
        </div>
      </div>
    </div>
  );
};
