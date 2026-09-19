import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Share2,
  Check,
  Plus,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Play,
  Eye,
  Heart,
  Grid,
  Palette,
  Info,
  ExternalLink,
  Users
} from 'lucide-react';
import { ArtVideoPost, CollaborationArtist } from '../types';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorHandle: string;
  creatorPost?: ArtVideoPost;
  artistInfo?: CollaborationArtist;
  allPosts: ArtVideoPost[];
  isFollowing: boolean;
  onToggleFollow: (creatorHandle: string) => void;
  onDirectMessage: (creatorPost: ArtVideoPost, initialMessage?: string) => void;
  onNavigateToCollab: (targetHandle: string) => void;
  onSelectVideoToPlay: (post: ArtVideoPost) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creatorHandle,
  creatorPost,
  artistInfo,
  allPosts,
  isFollowing,
  onToggleFollow,
  onDirectMessage,
  onNavigateToCollab,
  onSelectVideoToPlay,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'portfolio' | 'about'>('videos');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Retrieve creator's videos from the catalog
  const creatorVideos = allPosts.filter(
    (p) => p.creatorHandle.toLowerCase() === creatorHandle.toLowerCase()
  );

  // If none found by handle, at least include the creatorPost if provided
  const displayVideos = creatorVideos.length > 0 ? creatorVideos : (creatorPost ? [creatorPost] : []);

  // Compute stats or extract from artistInfo / post
  const name = artistInfo?.name || creatorPost?.creatorName || `@${creatorHandle}`;
  const handle = creatorHandle.replace('@', '');
  const avatar =
    artistInfo?.avatar ||
    creatorPost?.creatorAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
  const age = artistInfo?.age || creatorPost?.creatorAge || '16 ans';
  const role = artistInfo?.role || creatorPost?.creatorRole || 'Artiste Ado Créatif';
  const bio =
    artistInfo?.bio ||
    `Artiste adolescent(e) passionné(e) par la création originale sur ArtTok. Bienvenue dans mon catalogue d'œuvres !`;
  const category = artistInfo?.category || creatorPost?.categoryName || 'Arts Visuels';
  const tools = artistInfo?.tools || creatorPost?.artTools || ['Tablette', 'Carnet de croquis'];

  // Calculate total likes from their videos
  const totalLikes = displayVideos.reduce((acc, p) => acc + (p.likesCount || 0), 0) + 1250;
  const followersCount = 3840 + (isFollowing ? 1 : 0);
  const followingCount = 186;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:max-h-[92vh] sm:max-w-md bg-[#0e1017] sm:rounded-3xl border border-neutral-800 text-white flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80 bg-[#121520]/95 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-center">
            <span className="font-extrabold text-sm tracking-tight text-white">
              @{handle}
            </span>
            <span title="Artiste Vérifié ArtTok">
              <ShieldCheck className="w-4 h-4 text-[#25F4EE]" />
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Partager le profil"
            >
              {copied ? (
                <Check className="w-4.5 h-4.5 text-emerald-400" />
              ) : (
                <Share2 className="w-4.5 h-4.5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Profile Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header Card */}
          <div className="px-4 pt-4 pb-2 text-center flex flex-col items-center">
            {/* Avatar with Glow Ring */}
            <div className="relative">
              <div className="w-22 h-22 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FE2C55] via-[#25F4EE] to-[#FE2C55] shadow-xl">
                <img
                  src={avatar}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover bg-neutral-900"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0e1017]" title="Artiste en ligne" />
            </div>

            {/* Name, Age & Role */}
            <h2 className="text-lg font-black text-white mt-2 flex items-center justify-center gap-1.5">
              <span>{name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] font-bold border border-[#FE2C55]/30">
                {age}
              </span>
            </h2>
            <p className="text-xs text-[#25F4EE] font-semibold mt-0.5">{role}</p>

            {/* Counters Row: Abonnements, Abonnés, J'aime */}
            <div className="grid grid-cols-3 gap-6 py-3 px-6 my-2 border-y border-neutral-800/80 w-full max-w-sm">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-white">{followingCount}</span>
                <span className="text-[10px] text-neutral-400 font-medium">Abonnements</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-white">{followersCount.toLocaleString('fr-FR')}</span>
                <span className="text-[10px] text-neutral-400 font-medium">Abonnés</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-white">{(totalLikes / 1000).toFixed(1)}k</span>
                <span className="text-[10px] text-neutral-400 font-medium">J'aime</span>
              </div>
            </div>

            {/* Action Buttons: Follow, Message Privé, Collab */}
            {/* NOTE: Strictly NO "Modifier le profil" button for other creators! */}
            <div className="flex items-center gap-2 w-full max-w-sm my-1">
              {/* Follow Button */}
              <button
                id="creator-modal-btn-follow"
                onClick={() => onToggleFollow(handle)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  isFollowing
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-[#FE2C55] hover:bg-[#e0264b] text-white shadow-[#FE2C55]/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#25F4EE]" />
                    <span>Abonné</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>S'abonner</span>
                  </>
                )}
              </button>

              {/* Private Message Button */}
              <button
                id="creator-modal-btn-message"
                onClick={() => {
                  onClose();
                  if (creatorPost) {
                    onDirectMessage(creatorPost);
                  } else {
                    const fallbackPost: ArtVideoPost = {
                      id: `post-gen-${Date.now()}`,
                      creatorId: artistInfo?.id || `art-${handle}`,
                      creatorName: name,
                      creatorHandle: handle,
                      creatorAvatar: avatar,
                      creatorAge: age,
                      creatorRole: role,
                      categoryId: 'manga-webtoon',
                      categoryName: category,
                      caption: 'Discussion privée',
                      hashtags: [],
                      videoUrl: '',
                      artworkPoster: avatar,
                      soundTitle: 'Original',
                      soundArtist: name,
                      soundCover: avatar,
                      likesCount: 0,
                      commentsCount: 0,
                      sharesCount: 0,
                      bookmarksCount: 0,
                      comments: [],
                    };
                    onDirectMessage(fallbackPost);
                  }
                }}
                className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white border border-neutral-700 flex items-center gap-1.5 transition-colors active:scale-95"
                title="Envoyer un message privé et confidentiel"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25F4EE]" />
                <span>Message</span>
              </button>

              {/* Proposer Collab */}
              <button
                id="creator-modal-btn-collab"
                onClick={() => {
                  onClose();
                  onNavigateToCollab(handle);
                }}
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#FE2C55]/20 to-[#9D4EDD]/20 hover:from-[#FE2C55]/30 hover:to-[#9D4EDD]/30 text-xs font-bold text-white border border-[#FE2C55]/40 flex items-center gap-1 transition-colors active:scale-95"
                title="Proposer une collaboration artistique"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FE2C55]" />
                <span>Collab</span>
              </button>
            </div>

            {/* Read-Only Notice Badge */}
            <div className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
              <span>🔒 Profil public de l'artiste (consultation uniquement)</span>
            </div>

            {/* Bio Card */}
            <div className="mt-3 text-left w-full max-w-sm bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
              <p className="text-xs text-neutral-200 leading-relaxed">{bio}</p>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/30 font-medium">
                  🎨 {category}
                </span>
                {tools.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium"
                  >
                    🛠 {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs: Vidéos (Catalogue) | Portfolio | À propos */}
          <div className="flex border-b border-neutral-800 mt-2 bg-[#0e1017] sticky top-12 z-10">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'videos'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Vidéos ({displayVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'portfolio'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Palette className="w-4 h-4 text-[#25F4EE]" />
              <span>Catalogue & Œuvres</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'about'
                  ? 'border-white text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Info className="w-4 h-4 text-[#FE2C55]" />
              <span>Infos & Collab</span>
            </button>
          </div>

          {/* TAB 1: Vidéos & Catalogue */}
          {activeTab === 'videos' && (
            <div className="p-2">
              <div className="grid grid-cols-3 gap-1.5">
                {displayVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      onClose();
                      onSelectVideoToPlay(video);
                    }}
                    className="relative aspect-[9/16] bg-neutral-900 rounded-xl overflow-hidden cursor-pointer group border border-neutral-800/80 hover:border-white/40 transition-all"
                  >
                    <img
                      src={video.artworkPoster}
                      alt={video.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* View Count & Play indicator */}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold text-white">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{video.likesCount ? (video.likesCount > 1000 ? `${(video.likesCount / 1000).toFixed(1)}k` : video.likesCount) : '1.2k'}</span>
                    </div>

                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="p-1 rounded-full bg-black/60 text-white block">
                        <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Portfolio & Œuvres */}
          {activeTab === 'portfolio' && (
            <div className="p-3 space-y-3">
              <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#25F4EE]" />
                <span>Œuvres d'art & Échantillons créatifs</span>
              </h3>

              {artistInfo?.portfolioSamples && artistInfo.portfolioSamples.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {artistInfo.portfolioSamples.map((sample, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={sample.image}
                          alt={sample.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-white font-medium">
                          {sample.type}
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-white truncate">{sample.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {displayVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
                    >
                      <img
                        src={video.artworkPoster}
                        alt={video.caption}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-white truncate">{video.caption}</p>
                        <p className="text-[9px] text-neutral-400 mt-0.5">#{video.categoryName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: À propos & Collab */}
          {activeTab === 'about' && (
            <div className="p-3 space-y-3">
              {/* Collaboration availability */}
              <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#FE2C55]" />
                  <h4 className="text-xs font-bold text-white">Disponibilité pour Collaborer</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {artistInfo?.lookingFor ||
                    creatorPost?.collaborationNotice ||
                    'Ouvert(e) aux duos artistiques, scénarios et illustrations partagées.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCollab(handle);
                  }}
                  className="mt-2.5 w-full py-2 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#9D4EDD] text-white font-bold text-xs shadow-md transition-transform active:scale-98"
                >
                  Envoyer une proposition de collab 🤝
                </button>
              </div>

              {/* Skills and Tools */}
              <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold text-white">Compétences & Outils</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(artistInfo?.skills || ['Dessin', 'Colorisation', 'Scénario']).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-1 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700/60"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social networks */}
              <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1.5 text-xs text-neutral-300">
                <h4 className="text-xs font-bold text-white">Réseaux ArtTok</h4>
                <p>📸 Instagram : {artistInfo?.socials?.instagram || `@${handle}`}</p>
                <p>💬 Discord : {artistInfo?.socials?.discord || `${handle}#${Math.floor(1000 + Math.random() * 9000)}`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
