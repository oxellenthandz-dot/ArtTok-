import React, { useState, useEffect } from 'react';
import {
  ART_CATEGORIES,
  INITIAL_ART_POSTS,
  INITIAL_COLLAB_ARTISTS,
  INITIAL_STORY_SCENARIOS,
  INITIAL_USER_PROFILE,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import {
  ArtVideoPost,
  ArtCategory,
  CollaborationArtist,
  StoryScenario,
  MainTabType,
  UserProfileData,
  Conversation,
  NotificationItem,
} from './types';
import { TikTokFeed } from './components/TikTokFeed';
import { CategoriesView } from './components/CategoriesView';
import { CollaborationView } from './components/CollaborationView';
import { ScenariosView } from './components/ScenariosView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { BottomNavBar } from './components/BottomNavBar';
import { CreatePostModal } from './components/CreatePostModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTabType>('feed');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [targetArtistHandle, setTargetArtistHandle] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalMode, setCreateModalMode] = useState<'camera' | 'gallery' | 'live' | 'scenario'>('camera');
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<{
    handle: string;
    post?: ArtVideoPost;
  } | null>(null);
  const [isDesktopFullScreen, setIsDesktopFullScreen] = useState(false);

  // Persistent Posts
  const [posts, setPosts] = useState<ArtVideoPost[]>(() => {
    try {
      const saved = localStorage.getItem('arttok_posts_v2');
      return saved ? JSON.parse(saved) : INITIAL_ART_POSTS;
    } catch {
      return INITIAL_ART_POSTS;
    }
  });

  // Persistent Collab Artists
  const [artists, setArtists] = useState<CollaborationArtist[]>(() => {
    try {
      const saved = localStorage.getItem('arttok_artists_v2');
      return saved ? JSON.parse(saved) : INITIAL_COLLAB_ARTISTS;
    } catch {
      return INITIAL_COLLAB_ARTISTS;
    }
  });

  // User Collaboration Profile (Required registration for Collab tab)
  const [userCollabProfile, setUserCollabProfile] = useState<CollaborationArtist | null>(() => {
    try {
      const saved = localStorage.getItem('arttok_user_collab_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Profile Data (Profile page, stats, bio, followers, following)
  const [userAccountProfile, setUserAccountProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('arttok_user_account_v2');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Persistent Scenarios & Stories
  const [scenarios, setScenarios] = useState<StoryScenario[]>(() => {
    try {
      const saved = localStorage.getItem('arttok_scenarios_v2');
      return saved ? JSON.parse(saved) : INITIAL_STORY_SCENARIOS;
    } catch {
      return INITIAL_STORY_SCENARIOS;
    }
  });

  // Direct Messages & Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('arttok_conversations_v2');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('arttok_notifications_v2');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('arttok_posts_v2', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('arttok_artists_v2', JSON.stringify(artists));
    } catch {}
  }, [artists]);

  useEffect(() => {
    try {
      if (userCollabProfile) {
        localStorage.setItem('arttok_user_collab_v2', JSON.stringify(userCollabProfile));
      }
    } catch {}
  }, [userCollabProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('arttok_user_account_v2', JSON.stringify(userAccountProfile));
    } catch {}
  }, [userAccountProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('arttok_scenarios_v2', JSON.stringify(scenarios));
    } catch {}
  }, [scenarios]);

  useEffect(() => {
    try {
      localStorage.setItem('arttok_conversations_v2', JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('arttok_notifications_v2', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Feed Handlers
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isBookmarked = !p.isBookmarked;
          return {
            ...p,
            isBookmarked,
            bookmarksCount: isBookmarked
              ? p.bookmarksCount + 1
              : Math.max(0, p.bookmarksCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleToggleFollow = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextFollowing = !p.isFollowing;
          // Update following count on user account profile
          setUserAccountProfile((prof) => ({
            ...prof,
            followingCount: nextFollowing
              ? prof.followingCount + 1
              : Math.max(0, prof.followingCount - 1),
          }));
          return {
            ...p,
            isFollowing: nextFollowing,
          };
        }
        return p;
      })
    );
  };

  const handleToggleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextReposted = !p.isReposted;
          const currentCount = p.repostsCount || 0;
          return {
            ...p,
            isReposted: nextReposted,
            repostsCount: nextReposted ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return p;
      })
    );

    // Add activity notification
    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost && !targetPost.isReposted) {
      const newNotif: NotificationItem = {
        id: `notif-repost-${Date.now()}`,
        type: 'trend',
        title: 'Vidéo republiée sur ton profil',
        description: `Tu as republié la création de @${targetPost.creatorHandle} sur ton profil ArtTok.`,
        timeAgo: 'À l\'instant',
        read: false,
        avatar: targetPost.creatorAvatar,
        actorHandle: targetPost.creatorHandle,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleToggleFollowArtist = (artistHandle: string) => {
    let nowFollowing = false;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.creatorHandle === artistHandle) {
          nowFollowing = !p.isFollowing;
          return { ...p, isFollowing: !p.isFollowing };
        }
        return p;
      })
    );

    setUserAccountProfile((prof) => ({
      ...prof,
      followingCount: nowFollowing
        ? prof.followingCount + 1
        : Math.max(0, prof.followingCount - 1),
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: userAccountProfile.name,
            authorHandle: userAccountProfile.handle,
            authorAvatar: userAccountProfile.avatar,
            authorAge: userAccountProfile.age,
            text,
            likesCount: 0,
            timeAgo: 'À l\'instant',
            isLiked: false,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  // Collaboration Registration Handler
  const handleRegisterArtist = (newArtist: CollaborationArtist) => {
    setUserCollabProfile(newArtist);
    setUserAccountProfile((prev) => ({
      ...prev,
      isRegisteredInCollab: true,
      name: newArtist.name,
      handle: newArtist.handle,
      bio: newArtist.bio,
      role: newArtist.role,
      artCategory: newArtist.category,
    }));

    setArtists((prev) => {
      const existsIndex = prev.findIndex((a) => a.id === newArtist.id || a.handle === newArtist.handle);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newArtist;
        return copy;
      }
      return [newArtist, ...prev];
    });

    // Add notification
    const collabNotif: NotificationItem = {
      id: `notif-collab-reg-${Date.now()}`,
      type: 'collab_request',
      title: 'Inscription Collaboration Validée ! 🎉',
      description: 'Ton profil est désormais visible par tous les créateurs de la communauté ArtTok.',
      timeAgo: 'À l\'instant',
      read: false,
    };
    setNotifications((prev) => [collabNotif, ...prev]);
  };

  // Add new post handler
  const handleAddPost = (newPost: ArtVideoPost) => {
    // Tag creator as user-self so it displays on user profile
    const personalizedPost: ArtVideoPost = {
      ...newPost,
      creatorId: 'user-self',
      creatorName: userAccountProfile.name,
      creatorHandle: userAccountProfile.handle,
      creatorAvatar: userAccountProfile.avatar,
      creatorAge: userAccountProfile.age,
      creatorRole: userAccountProfile.role,
    };

    setPosts([personalizedPost, ...posts]);
    setActiveTab('feed');
  };

  // Add new story scenario handler
  const handleAddScenario = (newScenario: StoryScenario) => {
    setScenarios([newScenario, ...scenarios]);
  };

  // Direct message shortcut from share sheet or collaboration
  const handleDirectMessage = (postOrArtist: ArtVideoPost | CollaborationArtist, initialMessage?: string) => {
    const partnerId = 'creatorId' in postOrArtist ? postOrArtist.creatorId : postOrArtist.id;
    const partnerName = 'creatorName' in postOrArtist ? postOrArtist.creatorName : postOrArtist.name;
    const partnerHandle = 'creatorHandle' in postOrArtist ? postOrArtist.creatorHandle : postOrArtist.handle;
    const partnerAvatar = 'creatorAvatar' in postOrArtist ? postOrArtist.creatorAvatar : postOrArtist.avatar;
    const partnerRole = 'creatorRole' in postOrArtist ? postOrArtist.creatorRole : postOrArtist.role;

    // Check existing conversation
    let existingConv = conversations.find(
      (c) => c.partnerId === partnerId || c.partnerHandle === partnerHandle
    );

    if (existingConv) {
      if (initialMessage) {
        existingConv = {
          ...existingConv,
          lastMessage: initialMessage,
          lastMessageTime: 'À l\'instant',
          messages: [
            ...existingConv.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: 'user-self',
              senderName: userAccountProfile.name,
              senderHandle: userAccountProfile.handle,
              senderAvatar: userAccountProfile.avatar,
              text: initialMessage,
              timestamp: 'À l\'instant',
              isMe: true,
            },
          ],
        };
        setConversations(conversations.map((c) => (c.id === existingConv?.id ? existingConv! : c)));
      }
      setActiveConversationId(existingConv.id);
    } else {
      const newConv: Conversation = {
        id: `conv-${partnerId}-${Date.now()}`,
        partnerId,
        partnerName,
        partnerHandle,
        partnerAvatar,
        partnerRole,
        lastMessage: initialMessage || 'Nouvelle discussion artistique',
        lastMessageTime: 'À l\'instant',
        unreadCount: 0,
        messages: [
          {
            id: `msg-init-${Date.now()}`,
            senderId: 'user-self',
            senderName: userAccountProfile.name,
            senderHandle: userAccountProfile.handle,
            senderAvatar: userAccountProfile.avatar,
            text: initialMessage || `Salut ${partnerName} ! J'ai découvert tes créations sur ArtTok.`,
            timestamp: 'À l\'instant',
            isMe: true,
          },
        ],
      };
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
    }

    setActiveTab('messages');
  };

  // Navigation shortcuts
  const handleSelectCategoryFeed = (catId: string) => {
    setActiveCategoryId(catId);
    setActiveTab('feed');
  };

  const handleExploreArtists = (catId: string) => {
    setActiveTab('collaboration');
  };

  const handleNavigateToCollab = (targetHandle?: string) => {
    if (targetHandle) {
      setTargetArtistHandle(targetHandle);
    }
    setActiveTab('collaboration');
  };

  // Reposted posts list for profile
  const repostedPosts = posts.filter((p) => p.isReposted);

  // Total unread messages + unread notifs
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const totalInboxBadge = unreadMessagesCount + unreadNotifsCount;

  return (
    <div className="w-screen h-screen bg-[#07080b] flex flex-col items-center justify-center overflow-hidden font-sans select-none text-white">
      {/* Desktop Display Mode Switcher (visible only on large screens) */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 backdrop-blur-md shadow-xl">
        <span className="text-[11px] text-neutral-400 font-medium">Affichage:</span>
        <button
          onClick={() => setIsDesktopFullScreen(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            !isDesktopFullScreen
              ? 'bg-[#FE2C55] text-white font-bold shadow'
              : 'hover:text-white text-neutral-400'
          }`}
          title="Format Smartphone TikTok 9:16"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
        <button
          onClick={() => setIsDesktopFullScreen(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
            isDesktopFullScreen
              ? 'bg-[#25F4EE] text-black font-bold shadow'
              : 'hover:text-white text-neutral-400'
          }`}
          title="Format Plein Écran"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Large</span>
        </button>
      </div>

      {/* Main TikTok Container */}
      <div
        className={`relative w-full h-full bg-black overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
          isDesktopFullScreen
            ? 'max-w-none'
            : 'max-w-[480px] sm:max-h-[96vh] sm:rounded-[36px] sm:border-[6px] sm:border-neutral-800 sm:ring-1 sm:ring-neutral-700/50'
        }`}
      >
        {/* Smartphone Speaker notch on desktop frame */}
        {!isDesktopFullScreen && (
          <div className="hidden sm:block absolute top-2 inset-x-0 mx-auto w-24 h-4 rounded-full bg-black/80 z-50 pointer-events-none" />
        )}

        {/* TAB 1: ACCUEIL (TikTok Vertical Video Feed) */}
        {activeTab === 'feed' && (
          <TikTokFeed
            posts={posts}
            categories={ART_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onClearCategoryFilter={() => setActiveCategoryId(null)}
            onSelectCategory={(catId) => setActiveCategoryId(catId)}
            onNavigateToCollab={handleNavigateToCollab}
            onNavigateToScenario={() => setActiveTab('scenario')}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onToggleFollow={handleToggleFollow}
            onToggleRepost={handleToggleRepost}
            onDirectMessage={handleDirectMessage}
            onAddComment={handleAddComment}
            onOpenCreatorProfile={(handle, post) => setSelectedCreatorForProfile({ handle, post })}
          />
        )}

        {/* TAB 2: CATÉGORIES (Toutes sortes de catégories d'art) */}
        {activeTab === 'categories' && (
          <CategoriesView
            categories={ART_CATEGORIES}
            onSelectCategoryFeed={handleSelectCategoryFeed}
            onExploreArtists={handleExploreArtists}
          />
        )}

        {/* TAB 3: SCÉNARIO ET HISTOIRE (Scripts, storyboards, univers) */}
        {activeTab === 'scenario' && (
          <ScenariosView
            scenarios={scenarios}
            onAddScenario={handleAddScenario}
            onNavigateToCollab={handleNavigateToCollab}
          />
        )}

        {/* TAB 4: COLLABORATION (Recherche des collaborateurs & Inscription) */}
        {activeTab === 'collaboration' && (
          <CollaborationView
            artists={artists}
            userArtistProfile={userCollabProfile}
            onRegisterArtist={handleRegisterArtist}
            targetArtistHandle={targetArtistHandle}
            onClearTargetArtist={() => setTargetArtistHandle(null)}
            onNavigateToMessages={handleDirectMessage}
          />
        )}

        {/* TAB 5: MESSAGES (Boîte de réception, Chat & Notifications) */}
        {activeTab === 'messages' && (
          <MessagesView
            conversations={conversations}
            onUpdateConversations={setConversations}
            notifications={notifications}
            onUpdateNotifications={setNotifications}
            artists={artists}
            initialActiveConversationId={activeConversationId}
            onClearInitialConversation={() => setActiveConversationId(null)}
          />
        )}

        {/* TAB 6: PROFIL (Mon profil, vidéos postées, vidéos republiées, favoris, abonnés, abonnements) */}
        {activeTab === 'profile' && (
          <ProfileView
            profile={userAccountProfile}
            onUpdateProfile={setUserAccountProfile}
            posts={posts}
            repostedPosts={repostedPosts}
            userArtistProfile={userCollabProfile}
            onOpenCreate={() => {
              setCreateModalMode('camera');
              setIsCreateModalOpen(true);
            }}
            onNavigateToCollab={() => setActiveTab('collaboration')}
            allArtists={artists}
            onToggleFollowArtist={handleToggleFollowArtist}
            onOpenMessagesWithUser={(handle, name, avatar, role) => {
              const matchedArtist = artists.find((a) => a.handle === handle);
              if (matchedArtist) {
                handleDirectMessage(matchedArtist);
              } else {
                const tempArtist: CollaborationArtist = {
                  id: `artist-${handle}`,
                  name,
                  handle,
                  avatar,
                  age: '16 ans',
                  role,
                  category: 'Artiste',
                  bio: '',
                  skills: [role],
                  lookingFor: 'Collaborations créatives',
                  availableForCollab: true,
                  tools: ['ArtTok'],
                  portfolioSamples: [],
                  socials: {},
                  registeredDate: 'Récemment',
                  collabProjectsCount: 0,
                };
                handleDirectMessage(tempArtist);
              }
            }}
            onOpenCreatorProfile={(handle) => {
              const matchedPost = posts.find((p) => p.creatorHandle === handle);
              setSelectedCreatorForProfile({ handle, post: matchedPost });
            }}
          />
        )}

        {/* BOTTOM NAVIGATION BAR (TikTok 7-Item responsive bar) */}
        <BottomNavBar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'collaboration') {
              setTargetArtistHandle(null);
            }
          }}
          onOpenCreate={(mode) => {
            setCreateModalMode(mode || 'camera');
            setIsCreateModalOpen(true);
          }}
          isUserRegisteredForCollab={!!userCollabProfile}
          unreadCount={totalInboxBadge}
          userAvatar={userAccountProfile.avatar}
        />

        {/* CREATE / PUBLISH POST MODAL ([+] TikTok button - Caméra, Galerie, Live, Scénario) */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={ART_CATEGORIES}
          onAddPost={handleAddPost}
          onAddScenario={handleAddScenario}
          initialMode={createModalMode}
        />

        {/* READ-ONLY CREATOR PROFILE MODAL (When tapping creator in Pour Toi feed) */}
        {selectedCreatorForProfile && (
          <CreatorProfileModal
            isOpen={!!selectedCreatorForProfile}
            onClose={() => setSelectedCreatorForProfile(null)}
            creatorHandle={selectedCreatorForProfile.handle}
            creatorPost={selectedCreatorForProfile.post}
            artistInfo={artists.find(
              (a) => a.handle.toLowerCase() === selectedCreatorForProfile.handle.toLowerCase()
            )}
            allPosts={posts}
            isFollowing={posts.some(
              (p) =>
                p.creatorHandle.toLowerCase() === selectedCreatorForProfile.handle.toLowerCase() &&
                p.isFollowing
            )}
            onToggleFollow={(handleToFollow) => {
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.creatorHandle.toLowerCase() === handleToFollow.toLowerCase()) {
                    const nextFollow = !p.isFollowing;
                    return { ...p, isFollowing: nextFollow };
                  }
                  return p;
                })
              );
            }}
            onDirectMessage={(creatorPost) => {
              setSelectedCreatorForProfile(null);
              handleDirectMessage(creatorPost);
            }}
            onNavigateToCollab={(targetHandle) => {
              setSelectedCreatorForProfile(null);
              handleNavigateToCollab(targetHandle);
            }}
            onSelectVideoToPlay={(selectedPost) => {
              setSelectedCreatorForProfile(null);
              setActiveTab('feed');
            }}
          />
        )}
      </div>
    </div>
  );
}
