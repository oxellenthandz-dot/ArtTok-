import React, { useState } from 'react';
import {
  User,
  Settings,
  Share2,
  Edit3,
  Grid,
  Repeat2,
  Heart,
  Bookmark,
  Play,
  Sparkles,
  ExternalLink,
  Camera,
  Check,
  X,
  Plus,
  ShieldCheck,
  Eye,
  Film,
  UserCheck,
  UserPlus,
  MessageCircle,
  Lock,
  Search
} from 'lucide-react';
import { ArtVideoPost, UserProfileData, CollaborationArtist } from '../types';

interface ProfileViewProps {
  profile: UserProfileData;
  onUpdateProfile: (profile: UserProfileData) => void;
  posts: ArtVideoPost[];
  repostedPosts: ArtVideoPost[];
  userArtistProfile: CollaborationArtist | null;
  onOpenCreate: () => void;
  onNavigateToCollab: () => void;
  allArtists?: CollaborationArtist[];
  onToggleFollowArtist?: (handle: string) => void;
  onOpenMessagesWithUser?: (handle: string, name: string, avatar: string, role: string) => void;
  onOpenCreatorProfile?: (handle: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  posts,
  repostedPosts,
  userArtistProfile,
  onOpenCreate,
  onNavigateToCollab,
  allArtists = [],
  onToggleFollowArtist,
  onOpenMessagesWithUser,
  onOpenCreatorProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'my_posts' | 'reposted' | 'favoris' | 'liked'>('my_posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState(false);
  const [selectedVideoPreview, setSelectedVideoPreview] = useState<ArtVideoPost | null>(null);
  const [userListModalType, setUserListModalType] = useState<'followers' | 'following' | null>(null);
  const [likesPrivacyTooltip, setLikesPrivacyTooltip] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: profile.name,
    handle: profile.handle,
    bio: profile.bio,
    age: profile.age,
    role: profile.role,
    artCategory: profile.artCategory,
    avatar: profile.avatar,
    bannerImage: profile.bannerImage,
    instagram: profile.socials.instagram || '',
    discord: profile.socials.discord || '',
  });

  // Filter posts
  const myPosts = posts.filter(
    (p) => p.creatorId === 'user-self' || p.creatorId === 'art-self'
  );

  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);
  const likedPosts = posts.filter((p) => p.isLiked);

  // Dynamic following list derived from followed posts & collab artists
  const followedHandles = new Set(
    posts.filter((p) => p.isFollowing).map((p) => p.creatorHandle)
  );

  const followingList = allArtists
    .filter((a) => a.handle !== profile.handle)
    .map((a) => ({
      ...a,
      isFollowing: followedHandles.has(a.handle) || a.handle === 'leo_art_shonen' || a.handle === 'clara_pastel' || a.handle === 'yuto_webtoon',
    }))
    .filter((a) => a.isFollowing);

  // Followers list (people who follow me)
  const followersList = [
    {
      id: 'fol-maya',
      name: 'Maya 🌸',
      handle: 'artby_maya',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'Dessinatrice Manga & Webtoon',
      category: 'Manga & Webtoon',
      isFollowing: true,
      mutual: true,
    },
    {
      id: 'fol-lucas',
      name: 'Lucas Vauthier 🖋️',
      handle: 'lucas_scenario',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      role: 'Scénariste & Storyboarder',
      category: 'Scénarios & Écriture',
      isFollowing: false,
      mutual: false,
    },
    {
      id: 'fol-noah',
      name: 'Noah Beatmaker 🎧',
      handle: 'noah_lofi',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      role: 'Beatmaker & Lofi producer',
      category: 'Musique & Lofi Art',
      isFollowing: false,
      mutual: false,
    },
    {
      id: 'fol-ines',
      name: 'Inès Gouache 🎨',
      handle: 'ines_gouache',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      role: 'Peintre Traditionnelle',
      category: 'Peinture & Aquarelle',
      isFollowing: true,
      mutual: true,
    },
    {
      id: 'fol-kenji',
      name: 'Kenji 3D ⚡',
      handle: 'kenji_blender',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      role: 'Artiste 3D & Sculpteur',
      category: 'Sculpture & Modelage',
      isFollowing: false,
      mutual: false,
    },
  ];

  const handleShareProfile = () => {
    navigator.clipboard?.writeText?.(`https://arttok.app/@${profile.handle}`);
    setCopiedLinkNotice(true);
    setTimeout(() => setCopiedLinkNotice(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: editForm.name.trim() || profile.name,
      handle: editForm.handle.replace('@', '').trim() || profile.handle,
      bio: editForm.bio.trim(),
      age: editForm.age,
      role: editForm.role.trim() || profile.role,
      artCategory: editForm.artCategory.trim() || profile.artCategory,
      avatar: editForm.avatar.trim() || profile.avatar,
      bannerImage: editForm.bannerImage.trim() || profile.bannerImage,
      socials: {
        instagram: editForm.instagram.trim() || undefined,
        discord: editForm.discord.trim() || undefined,
        tiktok: `@${editForm.handle.replace('@', '').trim()}`,
      },
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto pb-24 pt-2 select-none no-scrollbar">
      <div className="max-w-xl mx-auto">
        {/* Top App Bar with Handle */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/60 sticky top-0 bg-[#0d0f14]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">
              @{profile.handle}
            </span>
            <span title="Artiste Ado Vérifié" className="inline-flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#25F4EE]" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-share-profile"
              onClick={handleShareProfile}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Partager mon profil"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="btn-edit-profile-icon"
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Modifier le profil"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedLinkNotice && (
          <div className="mx-4 mt-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center animate-in fade-in">
            ✓ Lien du profil copié dans le presse-papier !
          </div>
        )}

        {/* Profile Header Card */}
        <div className="px-4 pt-4 pb-2 text-center flex flex-col items-center">
          {/* Avatar with Ring & Edit Overlay */}
          <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FE2C55] via-[#25F4EE] to-[#FE2C55] shadow-xl">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover bg-neutral-900"
              />
            </div>
            <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#FE2C55] text-white shadow-lg group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* User Name & Role */}
          <h2 className="text-lg font-black text-white mt-2.5 flex items-center gap-1.5">
            <span>{profile.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] font-bold border border-[#FE2C55]/30">
              {profile.age}
            </span>
          </h2>
          <p className="text-xs text-[#25F4EE] font-semibold mt-0.5">{profile.role}</p>

          {/* TikTok Iconic Counters Row */}
          {/* Abonnement (que je suis), Abonnés (qui me suivent), J'aime */}
          <div className="grid grid-cols-3 gap-6 py-4 px-6 my-2 border-y border-neutral-800/80 w-full max-w-sm">
            {/* 1. Nombre de personnes que je suis */}
            <button
              id="btn-count-following"
              onClick={() => {
                setUserSearchQuery('');
                setUserListModalType('following');
              }}
              className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer group"
              title="Voir toutes les personnes que je suis"
            >
              <span className="text-base font-black text-white group-hover:text-[#25F4EE] transition-colors">
                {profile.followingCount}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-tight">
                Abonnements
              </span>
              <span className="text-[8.5px] text-[#25F4EE] font-semibold">(que je suis)</span>
            </button>

            {/* 2. Nombre de personnes qui me suivent */}
            <button
              id="btn-count-followers"
              onClick={() => {
                setUserSearchQuery('');
                setUserListModalType('followers');
              }}
              className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer group"
              title="Voir toutes les personnes qui se sont abonnées avec nous"
            >
              <span className="text-base font-black text-white group-hover:text-[#FE2C55] transition-colors">
                {profile.followersCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-tight">
                Abonnés
              </span>
              <span className="text-[8.5px] text-[#FE2C55] font-semibold">(qui me suivent)</span>
            </button>

            {/* 3. Nombre total de J'aime (Privé : Seulement pour les likes, on ne peut pas voir les personnes) */}
            <button
              id="btn-count-likes"
              onClick={() => {
                setLikesPrivacyTooltip(true);
                setTimeout(() => setLikesPrivacyTooltip(false), 4500);
              }}
              className="flex flex-col items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer group relative"
              title="Total de J'aime reçus (Liste des personnes privée)"
            >
              <span className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                {(profile.likesTotalCount / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-tight flex items-center gap-1">
                J'aime
                <Lock className="w-2.5 h-2.5 text-neutral-500 inline" />
              </span>
              <span className="text-[8.5px] text-neutral-500 font-medium">(anonymisé)</span>
            </button>
          </div>

          {/* Likes Privacy Notice Toast */}
          {likesPrivacyTooltip && (
            <div className="w-full max-w-sm mb-3 p-2.5 rounded-2xl bg-neutral-900/95 border border-[#FE2C55]/40 text-neutral-200 text-xs flex items-start gap-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <Lock className="w-4 h-4 text-[#FE2C55] shrink-0 mt-0.5" />
              <div className="text-left text-[11px] leading-tight">
                <span className="font-bold text-white block mb-0.5">🔒 Confidentialité des J'aime</span>
                <p className="text-neutral-400">
                  Seul le nombre total de mentions J'aime est consultable. La liste individuelle des personnes ayant aimé est confidentielle pour garantir la sécurité et la bienveillance envers les jeunes artistes.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full max-w-sm my-1">
            <button
              id="btn-edit-profile-main"
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white border border-neutral-700 transition-colors"
            >
              Modifier le profil
            </button>

            <button
              id="btn-profile-collab-status"
              onClick={onNavigateToCollab}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                userArtistProfile
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-[#FE2C55]/20 text-[#FE2C55] border border-[#FE2C55]/40 hover:bg-[#FE2C55]/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{userArtistProfile ? 'Inscrit Collab ✅' : 'Rejoindre Collab 🤝'}</span>
            </button>
          </div>

          {/* Bio & Details */}
          <div className="mt-3 max-w-sm text-left w-full space-y-1">
            <p className="text-xs text-neutral-200 leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-400">
              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                Spécialité : {profile.artCategory}
              </span>
              {profile.socials.instagram && (
                <span className="text-[#25F4EE]">IG: {profile.socials.instagram}</span>
              )}
              {profile.socials.discord && (
                <span className="text-[#9D4EDD]">Discord: {profile.socials.discord}</span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Tabs (TikTok Grid layout) */}
        <div className="mt-4 border-t border-neutral-800">
          <div className="grid grid-cols-4 border-b border-neutral-800">
            {/* Tab 1: Mes Vidéos Postées */}
            <button
              id="tab-profile-my-posts"
              onClick={() => setActiveTab('my_posts')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 text-[11px] sm:text-xs font-bold transition-all relative ${
                activeTab === 'my_posts' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Vidéos ({myPosts.length})</span>
              {activeTab === 'my_posts' && (
                <div className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-white" />
              )}
            </button>

            {/* Tab 2: Vidéos Republiées */}
            <button
              id="tab-profile-reposted"
              onClick={() => setActiveTab('reposted')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 text-[11px] sm:text-xs font-bold transition-all relative ${
                activeTab === 'reposted' ? 'text-[#25F4EE]' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Repeat2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Republier ({repostedPosts.length})</span>
              {activeTab === 'reposted' && (
                <div className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-[#25F4EE]" />
              )}
            </button>

            {/* Tab 3: Vidéos Favoris */}
            <button
              id="tab-profile-favoris"
              onClick={() => setActiveTab('favoris')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 text-[11px] sm:text-xs font-bold transition-all relative ${
                activeTab === 'favoris' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Favoris ({bookmarkedPosts.length})</span>
              {activeTab === 'favoris' && (
                <div className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-amber-400" />
              )}
            </button>

            {/* Tab 4: Vidéos Aimées */}
            <button
              id="tab-profile-liked"
              onClick={() => setActiveTab('liked')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 text-[11px] sm:text-xs font-bold transition-all relative ${
                activeTab === 'liked' ? 'text-[#FE2C55]' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Aimées ({likedPosts.length})</span>
              {activeTab === 'liked' && (
                <div className="absolute bottom-0 inset-x-2 sm:inset-x-4 h-0.5 bg-[#FE2C55]" />
              )}
            </button>
          </div>

          {/* TAB 1: MES VIDÉOS POSTÉES */}
          {activeTab === 'my_posts' && (
            <div className="p-2">
              {myPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedVideoPreview(post)}
                      className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-900 group cursor-pointer"
                    >
                      <img
                        src={post.artworkPoster}
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{post.likesCount}</span>
                      </div>
                      <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-black/60 text-neutral-300">
                        {post.categoryName.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 text-neutral-400">
                  <Film className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p className="font-bold text-sm text-white">Tu n'as pas encore publié de vidéo</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Partage tes coulisses de dessin, tes speedpaints ou tes planches avec la communauté d'ados !
                  </p>
                  <button
                    onClick={onOpenCreate}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
                  >
                    Publier ma première création 🚀
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TOUTES LES VIDÉOS REPUBLIÉES */}
          {activeTab === 'reposted' && (
            <div className="p-2">
              {repostedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {repostedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedVideoPreview(post)}
                      className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-900 group cursor-pointer border border-[#25F4EE]/30"
                    >
                      <img
                        src={post.artworkPoster}
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {/* Repost green badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#25F4EE] text-black">
                        <Repeat2 className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Republié</span>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                        <Play className="w-3 h-3 fill-current" />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 text-[9px] text-neutral-300 truncate max-w-[60px]">
                        @{post.creatorHandle}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 text-neutral-400">
                  <Repeat2 className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p className="font-bold text-sm text-white">Aucune vidéo republiée pour l'instant</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Republie des créations de tes artistes ados préférés depuis le flux d'accueil pour les afficher fièrement sur ton profil !
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOUTES LES VIDÉOS FAVORIS */}
          {activeTab === 'favoris' && (
            <div className="p-2">
              {bookmarkedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {bookmarkedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedVideoPreview(post)}
                      className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-900 group cursor-pointer border border-amber-500/30"
                    >
                      <img
                        src={post.artworkPoster}
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {/* Favori golden badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-black shadow">
                        <Bookmark className="w-2.5 h-2.5 fill-current" />
                        <span>Favori</span>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                        <Bookmark className="w-3 h-3 fill-current text-amber-400" />
                        <span>{post.bookmarksCount || 0}</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 text-[9px] text-neutral-300 truncate max-w-[60px]">
                        @{post.creatorHandle}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 text-neutral-400">
                  <Bookmark className="w-10 h-10 mx-auto text-amber-400/50 mb-2" />
                  <p className="font-bold text-sm text-white">Aucune vidéo en favoris</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Touche l'icône de marque-page dans le fil vidéo pour enregistrer tes créations favorites et les retrouver ici !
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VIDÉOS AIMÉES */}
          {activeTab === 'liked' && (
            <div className="p-2">
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {likedPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedVideoPreview(post)}
                      className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-900 group cursor-pointer"
                    >
                      <img
                        src={post.artworkPoster}
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                        <Heart className="w-3 h-3 fill-current text-[#FE2C55]" />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 text-[9px] text-neutral-300 truncate max-w-[60px]">
                        @{post.creatorHandle}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 text-neutral-400">
                  <Heart className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p className="font-bold text-sm text-white">Aucune vidéo aimée</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Double-clique sur les vidéos du flux d'accueil pour les ajouter à tes coups de cœur !
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {selectedVideoPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4"
          onClick={() => setSelectedVideoPreview(null)}
        >
          <div
            className="w-full max-w-sm bg-[#161824] rounded-3xl overflow-hidden border border-neutral-800 flex flex-col shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-9/16 w-full bg-black">
              <img
                src={selectedVideoPreview.artworkPoster}
                alt={selectedVideoPreview.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedVideoPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white">
                    @{selectedVideoPreview.creatorHandle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FE2C55] font-bold text-white">
                    {selectedVideoPreview.categoryName}
                  </span>
                </div>
                <p className="text-xs text-neutral-200 line-clamp-3">{selectedVideoPreview.caption}</p>
                <div className="flex items-center gap-4 mt-2.5 text-xs text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#FE2C55] fill-current" />
                    {selectedVideoPreview.likesCount}
                  </span>
                  <span>{selectedVideoPreview.commentsCount} commentaires</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWERS / FOLLOWING LIST MODAL */}
      {userListModalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setUserListModalType(null)}
        >
          <div
            className="w-full max-w-md max-h-[85vh] bg-[#141722] rounded-3xl border border-neutral-800 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#181c2b] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white">
                  {userListModalType === 'followers' ? (
                    <UserPlus className="w-4 h-4 text-[#FE2C55]" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-[#25F4EE]" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {userListModalType === 'followers'
                      ? 'Abonnés (Qui me suivent)'
                      : 'Abonnements (Personnes que je suis)'}
                  </h3>
                  <p className="text-[10px] text-neutral-400">
                    {userListModalType === 'followers'
                      ? `${profile.followersCount.toLocaleString('fr-FR')} personnes se sont abonnées avec toi`
                      : `${profile.followingCount} personnes suivies par ton compte`}
                  </p>
                </div>
              </div>

              <button
                id="btn-close-follow-modal"
                onClick={() => setUserListModalType(null)}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter in user list */}
            <div className="p-3 border-b border-neutral-800/60 bg-[#12141c] shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, @pseudo ou art..."
                  className="w-full bg-[#1c202d] border border-neutral-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>
            </div>

            {/* User List scroll area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              {userListModalType === 'following' ? (
                /* LIST OF PEOPLE I FOLLOW */
                followingList
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      user.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#181c2b]/90 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                        onClick={() => {
                          setUserListModalType(null);
                          if (onOpenCreatorProfile) onOpenCreatorProfile(user.handle);
                        }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                            <span>{user.name}</span>
                            <span className="text-[10px] text-neutral-400">@{user.handle}</span>
                          </h4>
                          <p className="text-[10px] text-[#25F4EE] font-medium truncate">
                            {user.role}
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-medium">
                            {user.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Message private shortcut */}
                        <button
                          onClick={() => {
                            setUserListModalType(null);
                            if (onOpenMessagesWithUser) {
                              onOpenMessagesWithUser(
                                user.handle,
                                user.name,
                                user.avatar,
                                user.role
                              );
                            }
                          }}
                          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                          title={`Envoyer un message privé à @${user.handle}`}
                        >
                          <MessageCircle className="w-4 h-4 text-[#25F4EE]" />
                        </button>

                        {/* Unfollow / Follow button */}
                        <button
                          onClick={() => {
                            if (onToggleFollowArtist) onToggleFollowArtist(user.handle);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-[#25F4EE]" />
                          <span>Abonné</span>
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                /* LIST OF FOLLOWERS WHO FOLLOW ME */
                followersList
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      user.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#181c2b]/90 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                        onClick={() => {
                          setUserListModalType(null);
                          if (onOpenCreatorProfile) onOpenCreatorProfile(user.handle);
                        }}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-neutral-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                            <span>{user.name}</span>
                            <span className="text-[10px] text-neutral-400">@{user.handle}</span>
                          </h4>
                          <p className="text-[10px] text-[#25F4EE] font-medium truncate">
                            {user.role}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-medium">
                              {user.category}
                            </span>
                            {user.mutual && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                Amis 🤝
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Message private button */}
                        <button
                          onClick={() => {
                            setUserListModalType(null);
                            if (onOpenMessagesWithUser) {
                              onOpenMessagesWithUser(
                                user.handle,
                                user.name,
                                user.avatar,
                                user.role
                              );
                            }
                          }}
                          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                          title={`Envoyer un message privé à @${user.handle}`}
                        >
                          <MessageCircle className="w-4 h-4 text-[#25F4EE]" />
                        </button>

                        {/* Follow back button */}
                        <button
                          onClick={() => {
                            if (onToggleFollowArtist) onToggleFollowArtist(user.handle);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                            user.isFollowing
                              ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700'
                              : 'bg-[#FE2C55] hover:bg-[#e0264b] text-white shadow-md'
                          }`}
                        >
                          {user.isFollowing ? (
                            <>
                              <Check className="w-3 h-3 text-[#25F4EE]" />
                              <span>Abonné</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>En retour</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
              )}

              {/* Empty state if search yields no results */}
              {userListModalType === 'following' && followingList.length === 0 && (
                <div className="text-center py-10 text-neutral-400">
                  <UserCheck className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs font-semibold">Tu ne suis aucun compte pour le moment</p>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Découvre des artistes ados dans l'onglet Explorer ou Collaboration !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#161824] rounded-3xl p-5 border border-neutral-800 text-white max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#25F4EE]" />
                <span>Modifier mon profil ArtTok</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Nom public</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Pseudo @</label>
                  <input
                    type="text"
                    required
                    value={editForm.handle}
                    onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Âge</label>
                  <select
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  >
                    <option value="14 ans">14 ans</option>
                    <option value="15 ans">15 ans</option>
                    <option value="16 ans">16 ans</option>
                    <option value="17 ans">17 ans</option>
                    <option value="18 ans">18 ans</option>
                    <option value="19 ans">19 ans</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Spécialité artistique
                  </label>
                  <input
                    type="text"
                    value={editForm.artCategory}
                    onChange={(e) => setEditForm({ ...editForm, artCategory: e.target.value })}
                    placeholder="Manga, Sculpture, 3D..."
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Rôle ou Titre d'artiste
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  placeholder="Dessinateur Manga, Sculpteur d'argile..."
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Bio / Présentation</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Présente ton univers artistique et tes projets..."
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">URL Avatar (Image)</label>
                <input
                  type="url"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Instagram</label>
                  <input
                    type="text"
                    value={editForm.instagram}
                    onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                    placeholder="@ton_art"
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Discord</label>
                  <input
                    type="text"
                    value={editForm.discord}
                    onChange={(e) => setEditForm({ ...editForm, discord: e.target.value })}
                    placeholder="pseudo#0000"
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-save-profile"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:opacity-90 text-white font-bold text-xs shadow-lg transition-transform active:scale-98"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
