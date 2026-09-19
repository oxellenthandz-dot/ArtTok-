import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Music2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { ArtVideoPost, ArtCategory } from '../types';
import { RightActionBar } from './RightActionBar';
import { CommentsSheet } from './CommentsSheet';
import { ShareModal } from './ShareModal';

interface TikTokFeedProps {
  posts: ArtVideoPost[];
  categories: ArtCategory[];
  activeCategoryId: string | null;
  onClearCategoryFilter: () => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateToCollab: (targetArtistHandle?: string) => void;
  onNavigateToScenario: () => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onToggleFollow: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onToggleRepost?: (postId: string) => void;
  onDirectMessage?: (post: ArtVideoPost) => void;
  onOpenCreatorProfile?: (creatorHandle: string, post: ArtVideoPost) => void;
}

export const TikTokFeed: React.FC<TikTokFeedProps> = ({
  posts,
  categories,
  activeCategoryId,
  onClearCategoryFilter,
  onSelectCategory,
  onNavigateToCollab,
  onNavigateToScenario,
  onToggleLike,
  onToggleBookmark,
  onToggleFollow,
  onAddComment,
  onToggleRepost,
  onDirectMessage,
  onOpenCreatorProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [feedMode, setFeedMode] = useState<'foryou' | 'following'>('foryou');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [doubleTapHearts, setDoubleTapHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [expandCaption, setExpandCaption] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTapRef = useRef<number>(0);

  // Filter posts if activeCategoryId or following mode
  const filteredPosts = posts.filter((p) => {
    if (activeCategoryId && p.categoryId !== activeCategoryId) return false;
    if (feedMode === 'following') return p.isFollowing;
    return true;
  });

  const currentPost: ArtVideoPost | undefined =
    filteredPosts[currentIndex] || filteredPosts[0] || posts[0];

  // Automatic sound activation on user interaction if initial autoplay was muted
  useEffect(() => {
    const handleFirstGesture = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    // When post changes, reset playing and caption, and ensure sound plays automatically
    setIsPlaying(true);
    setExpandCaption(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {
        // If unmuted autoplay is strictly restricted before user touches screen
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [currentIndex, currentPost?.id, isMuted]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentsOpen || isShareOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredPosts.length, isCommentsOpen, isShareOpen]);

  const handleNext = () => {
    if (currentIndex < filteredPosts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredPosts.length - 1);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Double tap to like
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      const rect = containerRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      const heartId = Date.now();
      setDoubleTapHearts((prev) => [...prev, { id: heartId, x, y }]);
      setTimeout(() => {
        setDoubleTapHearts((prev) => prev.filter((h) => h.id !== heartId));
      }, 1000);

      if (currentPost && !currentPost.isLiked) {
        onToggleLike(currentPost.id);
      }
    } else {
      // Single tap -> toggle play/pause
      togglePlayPause();
    }
    lastTapRef.current = now;
  };

  const currentCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden select-none"
      onClick={handleContainerClick}
    >
      {/* Background Video Player */}
      {currentPost && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-neutral-950">
          <video
            ref={videoRef}
            src={currentPost.videoUrl}
            poster={currentPost.artworkPoster}
            loop
            playsInline
            muted={isMuted}
            autoPlay
            className="w-full h-full object-cover sm:object-contain sm:max-h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Gradient overlays for TikTok readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>
      )}

      {/* Floating Hearts from Double Tap */}
      {doubleTapHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: heart.x, top: heart.y }}
        >
          <div className="text-[#FE2C55] drop-shadow-[0_0_12px_rgba(254,44,85,0.8)] text-7xl select-none scale-125">
            ❤️
          </div>
        </div>
      ))}

      {/* Big Play/Pause indicator when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white/90 scale-125 transition-transform animate-in fade-in zoom-in-75">
            <Play className="w-8 h-8 fill-white/90 ml-1" />
          </div>
        </div>
      )}

      {/* TOP HEADER: Following / For You / Active Category filter */}
      <div
        className="absolute top-0 inset-x-0 z-30 pt-3 pb-4 px-4 flex items-center justify-between text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Sound / Mute toggle */}
        <button
          id="btn-toggle-sound"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/60 transition-colors"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-neutral-300" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#25F4EE]" />
          )}
        </button>

        {/* Center Tabs: Abonnements | Pour toi */}
        <div className="flex items-center gap-4 text-base font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <button
            id="tab-feed-following"
            onClick={() => {
              setFeedMode('following');
              setCurrentIndex(0);
            }}
            className={`transition-all duration-200 pb-1 ${
              feedMode === 'following'
                ? 'text-white border-b-2 border-white scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Abonnements
          </button>
          <span className="text-neutral-500 font-light">|</span>
          <button
            id="tab-feed-foryou"
            onClick={() => {
              setFeedMode('foryou');
              setCurrentIndex(0);
            }}
            className={`transition-all duration-200 pb-1 ${
              feedMode === 'foryou'
                ? 'text-white border-b-2 border-white scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Pour toi
          </button>
        </div>

        {/* Right: Category quick badge or Scénario shortcut */}
        <div className="flex items-center gap-2">
          {activeCategoryId && (
            <button
              onClick={onClearCategoryFilter}
              className="text-xs px-2.5 py-1 rounded-full bg-[#FE2C55] text-white font-medium flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
            >
              <span>{currentCategory?.name || 'Filtre'}</span>
              <span className="text-xs opacity-75">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Category active banner indicator (if filtered) */}
      {activeCategoryId && currentCategory && (
        <div
          className="absolute top-14 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#25F4EE]/40 text-xs text-[#25F4EE] flex items-center gap-1.5 shadow-lg animate-in slide-in-from-top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Filtre d'Art: <strong>{currentCategory.name}</strong></span>
          <button
            onClick={onClearCategoryFilter}
            className="ml-1 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Desktop / Tablet Scroll Buttons (Up / Down) */}
      <div
        className="hidden md:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center shadow-lg border border-white/10 transition-transform hover:scale-110 active:scale-95"
          title="Vidéo précédente (Flèche Haut)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center shadow-lg border border-white/10 transition-transform hover:scale-110 active:scale-95"
          title="Vidéo suivante (Flèche Bas)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* RIGHT ACTION BAR: Likes, Comments, Bookmark, Republier, Share, Vinyl Record */}
      {currentPost && (
        <RightActionBar
          post={currentPost}
          onLike={() => onToggleLike(currentPost.id)}
          onBookmark={() => onToggleBookmark(currentPost.id)}
          onFollow={() => onToggleFollow(currentPost.id)}
          onRepost={() => onToggleRepost?.(currentPost.id)}
          onOpenComments={() => setIsCommentsOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onSoundClick={() => setIsMuted(!isMuted)}
          onOpenCreatorProfile={() => onOpenCreatorProfile?.(currentPost.creatorHandle, currentPost)}
          isPlaying={isPlaying}
        />
      )}

      {/* BOTTOM LEFT OVERLAY: Creator info, caption, tags, collab notice, sound marquee */}
      {currentPost && (
        <div
          className="absolute left-3 right-18 bottom-16 z-20 text-white select-text pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Creator handle, Age and Role */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <button
              id={`feed-creator-handle-${currentPost.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreatorProfile?.(currentPost.creatorHandle, currentPost);
              }}
              className="font-bold text-base tracking-wide text-shadow-tiktok text-white flex items-center gap-1.5 hover:underline cursor-pointer group text-left"
              title={`Voir tout le catalogue et profil de @${currentPost.creatorHandle}`}
            >
              <span>@{currentPost.creatorHandle}</span>
              <span className="w-2 h-2 rounded-full bg-[#25F4EE] inline-block group-hover:scale-125 transition-transform" />
            </button>

            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-medium border border-white/20">
              {currentPost.creatorAge}
            </span>

            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FE2C55]/30 text-[#FE2C55] font-semibold border border-[#FE2C55]/40">
              {currentPost.creatorRole}
            </span>
          </div>

          {/* Caption with Expand / Collapse */}
          <div className="text-sm text-neutral-100 text-shadow-tiktok mb-2 leading-snug">
            <p className={`${expandCaption ? '' : 'line-clamp-2'} text-sm`}>
              {currentPost.caption}
            </p>
            {currentPost.caption.length > 80 && (
              <button
                onClick={() => setExpandCaption(!expandCaption)}
                className="text-xs font-bold text-neutral-300 hover:text-white mt-0.5 inline-block"
              >
                {expandCaption ? 'Moins' : 'Plus...'}
              </button>
            )}
          </div>

          {/* Art Category Pill & Hashtags */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2 text-xs">
            <button
              onClick={() => onSelectCategory(currentPost.categoryId)}
              className="px-2 py-0.5 rounded-md bg-[#25F4EE]/20 hover:bg-[#25F4EE]/30 text-[#25F4EE] font-medium border border-[#25F4EE]/30 transition-colors"
            >
              🏷️ {currentPost.categoryName}
            </button>
            {currentPost.hashtags.map((tag) => (
              <span key={tag} className="font-semibold text-white/90 hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          {/* Art tools used badge */}
          {currentPost.artTools && currentPost.artTools.length > 0 && (
            <div className="text-[11px] text-neutral-300 text-shadow-tiktok mb-2 flex items-center gap-1 opacity-90">
              <span className="text-[#25F4EE]">🛠 Outils:</span> {currentPost.artTools.join(' • ')}
            </div>
          )}

          {/* Collaboration Announcement Notice if seeking collaborator */}
          {currentPost.collaborationNotice && (
            <div
              onClick={() => onNavigateToCollab(currentPost.creatorHandle)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#FE2C55]/80 to-[#9D4EDD]/80 text-white text-xs font-semibold shadow-lg hover:scale-102 transition-transform cursor-pointer mb-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{currentPost.collaborationNotice}</span>
              <span className="underline ml-1">Voir profil →</span>
            </div>
          )}

          {/* Sound Marquee Ticker */}
          <div className="flex items-center gap-2 text-xs text-neutral-200 overflow-hidden w-64 max-w-full">
            <Music2 className="w-3.5 h-3.5 flex-shrink-0 text-white" />
            <div className="overflow-hidden relative w-full">
              <span className="animate-marquee font-medium">
                ♫ {currentPost.soundTitle} — {currentPost.soundArtist} &nbsp;&nbsp;&nbsp; ♫ {currentPost.soundTitle} — {currentPost.soundArtist}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Video Progress Bar */}
      <div className="absolute bottom-12 inset-x-0 h-1 bg-white/20 z-20">
        <div className="h-full bg-white transition-all duration-300 w-2/3" />
      </div>

      {/* Comments Drawer */}
      {currentPost && (
        <CommentsSheet
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          comments={currentPost.comments}
          onAddComment={(text) => onAddComment(currentPost.id, text)}
        />
      )}

      {/* Share Modal */}
      {currentPost && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          post={currentPost}
          onToggleRepost={onToggleRepost}
          onDirectMessage={onDirectMessage}
          onCollaborateShortcut={() => {
            setIsShareOpen(false);
            onNavigateToCollab(currentPost.creatorHandle);
          }}
        />
      )}
    </div>
  );
};
