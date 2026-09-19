export interface CommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorAge?: string;
  text: string;
  likesCount: number;
  timeAgo: string;
  isLiked?: boolean;
}

export interface ArtVideoPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorAge: string;
  creatorRole: string;
  isVerifiedTeen?: boolean;
  categoryId: string;
  categoryName: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  artworkPoster: string;
  soundTitle: string;
  soundArtist: string;
  soundCover: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  isReposted?: boolean;
  repostsCount?: number;
  artTools?: string[];
  collaborationNotice?: string;
  comments: CommentItem[];
}

export interface ArtCategory {
  id: string;
  name: string;
  subtitle: string;
  domain: 'visuel' | 'plastique' | 'numerique' | 'applique' | 'vivant' | 'sonore' | 'narratif';
  iconName: string;
  color: string;
  coverImage: string;
  postCount: number;
  artistsCount: number;
  popularTags: string[];
  description: string;
}

export interface CollaborationArtist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  age: string;
  role: string;
  category: string;
  bio: string;
  skills: string[];
  lookingFor: string;
  availableForCollab: boolean;
  tools: string[];
  portfolioSamples: {
    title: string;
    image: string;
    type: string;
  }[];
  socials: {
    instagram?: string;
    discord?: string;
    tiktok?: string;
  };
  isSelf?: boolean;
  registeredDate: string;
  collabProjectsCount: number;
}

export interface StoryPanel {
  order: number;
  title: string;
  visualNotes: string;
  dialogue?: string;
  sketchUrl?: string;
}

export interface StoryScenario {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  genre: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    age: string;
    role: string;
  };
  targetFormat: 'Manga' | 'Webtoon' | 'Court-Métrage' | 'BD Franco-Belge' | 'Animation';
  status: 'Recherche Dessinateur' | 'Recherche Coloriste' | 'En cours d\'écriture' | 'Collab active';
  tags: string[];
  likesCount: number;
  collaboratorsNeeded: string[];
  panels: StoryPanel[];
  createdAt: string;
  commentsCount: number;
}

export type MainTabType =
  | 'feed'
  | 'categories'
  | 'collaboration'
  | 'scenario'
  | 'messages'
  | 'profile';

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'audio' | 'scenario';
  isMe: boolean;
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerHandle: string;
  partnerAvatar: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectMessage[];
  isOnline?: boolean;
  lastSeen?: string;
}

export interface FollowUserItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  artCategory?: string;
  isFollowing: boolean;
  mutualFollow?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'follow' | 'collab_request' | 'comment' | 'trend';
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  avatar?: string;
  actorHandle?: string;
  targetPostId?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bannerImage: string;
  bio: string;
  age: string;
  role: string;
  artCategory: string;
  followersCount: number;
  followingCount: number;
  likesTotalCount: number;
  portfolioUrl?: string;
  isRegisteredInCollab: boolean;
  socials: {
    instagram?: string;
    discord?: string;
    tiktok?: string;
  };
}
