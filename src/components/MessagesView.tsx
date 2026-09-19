import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Bell,
  Search,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Sparkles,
  Heart,
  UserPlus,
  TrendingUp,
  Image as ImageIcon,
  Smile,
  Users,
  Plus
} from 'lucide-react';
import { Conversation, DirectMessage, NotificationItem, CollaborationArtist } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  onUpdateConversations: (convs: Conversation[]) => void;
  notifications: NotificationItem[];
  onUpdateNotifications: (notifs: NotificationItem[]) => void;
  artists: CollaborationArtist[];
  initialActiveConversationId?: string | null;
  onClearInitialConversation?: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  onUpdateConversations,
  notifications,
  onUpdateNotifications,
  artists,
  initialActiveConversationId,
  onClearInitialConversation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'messages' | 'notifications'>('messages');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialActiveConversationId || null
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'collab' | 'likes'>('all');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  const convsRef = useRef(conversations);
  convsRef.current = conversations;

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Quick suggestions for teen artists
  const quickSuggestions = [
    'Salut ! Chaud pour un projet duo ? 🤝',
    'J’adore ton style de dessin ! ✨',
    'Tu utilises quel logiciel pour l’encrage ? 🖊️',
    'J’ai un scénario prêt si tu veux voir ! 📖',
  ];

  const handleToggleOnlineStatus = (convId: string) => {
    const updated = conversations.map((c) => {
      if (c.id === convId) {
        const nextOnline = !c.isOnline;
        return {
          ...c,
          isOnline: nextOnline,
          lastSeen: nextOnline ? undefined : 'il y a quelques minutes',
        };
      }
      return c;
    });
    onUpdateConversations(updated);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || messageInput).trim();
    if (!text || !activeConversation) return;

    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-self',
      senderName: 'Toi',
      senderHandle: 'mon_art_ado',
      senderAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      text,
      timestamp: 'À l’instant',
      isMe: true,
    };

    const updatedConvs = conversations.map((c) => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: 'À l’instant',
          messages: [...c.messages, newMessage],
        };
      }
      return c;
    });

    onUpdateConversations(updatedConvs);
    setMessageInput('');

    // STRICT USER INTENT RULE:
    // Pas de réponse automatique de l'IA !
    // Si l'artiste est en ligne (isOnline === true), il peut répondre.
    // Si l'artiste n'est pas en ligne (isOnline === false), il NE PEUT PAS répondre !
    const isOnline = activeConversation.isOnline ?? false;

    if (!isOnline) {
      // L'utilisateur est HORS LIGNE: aucune réponse automatique !
      setOfflineNotice(
        `@${activeConversation.partnerHandle} est actuellement hors ligne. Il ne peut pas te répondre pour le moment et recevra ton message lors de sa prochaine connexion.`
      );
      setTimeout(() => setOfflineNotice(null), 6000);
      return;
    }

    // Si l'utilisateur est EN LIGNE: il tape et répond
    setIsPartnerTyping(true);
    setTimeout(() => {
      setIsPartnerTyping(false);

      let replies = [
        'Trop stylé ! Merci beaucoup pour ton message 🙌',
        'Carrément ! Envoie-moi un aperçu de tes créations dès que tu peux ✨',
        'Grave chaud ! On pourrait mélanger nos deux univers pour un super post ArtTok 🚀',
        'Trop bien, je regarde ça et je te redis vite ! 🔥',
      ];

      const partnerRoleLower = (activeConversation.partnerRole || '').toLowerCase();
      if (partnerRoleLower.includes('manga') || partnerRoleLower.includes('dessin')) {
        replies = [
          'Trop stylé ! Je suis sur ma tablette graphique en ce moment même, je jette un œil à ton profil ! 🎨',
          'Carrément ! Si tu as des planches ou des speedpaints à partager, envoie ! ✨',
        ];
      } else if (partnerRoleLower.includes('scénar')) {
        replies = [
          'Génial ! Je suis en train de relire les dialogues de mon projet, ton profil m\'intéresse grave 🖋️',
          'Super ! Dis-moi quel format de scénario tu préfères (Manga ou Webtoon) ! 📖',
        ];
      } else if (partnerRoleLower.includes('beat') || partnerRoleLower.includes('musique') || partnerRoleLower.includes('lofi')) {
        replies = [
          'Yes carrément ! Je te prépare une boucle lofi exclusive pour accompagner ton dessin 🎧',
        ];
      }

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMessage: DirectMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: activeConversation.partnerId,
        senderName: activeConversation.partnerName,
        senderHandle: activeConversation.partnerHandle,
        senderAvatar: activeConversation.partnerAvatar,
        text: randomReply,
        timestamp: 'À l’instant',
        isMe: false,
      };

      const nextConvs = convsRef.current.map((c: Conversation) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: randomReply,
            lastMessageTime: 'À l’instant',
            messages: [...c.messages, replyMessage],
          };
        }
        return c;
      });
      onUpdateConversations(nextConvs);
    }, 1800);
  };

  const handleStartNewChat = (artist: CollaborationArtist) => {
    // Check if conversation already exists
    const existing = conversations.find((c) => c.partnerId === artist.id || c.partnerHandle === artist.handle);
    if (existing) {
      setActiveConversationId(existing.id);
      setIsNewChatModalOpen(false);
      return;
    }

    // Create new conversation
    const newConv: Conversation = {
      id: `conv-${artist.id}-${Date.now()}`,
      partnerId: artist.id,
      partnerName: artist.name,
      partnerHandle: artist.handle,
      partnerAvatar: artist.avatar,
      partnerRole: artist.role,
      lastMessage: 'Discussion artistique ouverte',
      lastMessageTime: 'À l’instant',
      unreadCount: 0,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderId: artist.id,
          senderName: artist.name,
          senderHandle: artist.handle,
          senderAvatar: artist.avatar,
          text: `Salut ! Merci pour le message. Qu'est-ce qui te ferait plaisir comme collaboration ?`,
          timestamp: 'À l’instant',
          isMe: false,
        },
      ],
    };

    onUpdateConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
    setIsNewChatModalOpen(false);
  };

  const handleMarkAllNotifsAsRead = () => {
    onUpdateNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'collab') return n.type === 'collab_request';
    if (notifFilter === 'likes') return n.type === 'like' || n.type === 'comment';
    return true;
  });

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white flex flex-col select-none overflow-hidden pb-16">
      {/* If in active conversation thread */}
      {activeConversation ? (
        <div className="w-full h-full flex flex-col bg-[#0b0c10]">
          {/* Chat Header */}
          <div className="h-14 px-3 border-b border-neutral-800/80 bg-[#12141c] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveConversationId(null);
                  if (onClearInitialConversation) onClearInitialConversation();
                }}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Retour aux discussions"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <img
                  src={activeConversation.partnerAvatar}
                  alt={activeConversation.partnerName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#12141c] ${
                    activeConversation.isOnline ? 'bg-emerald-500' : 'bg-neutral-500'
                  }`}
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {activeConversation.partnerName}
                </h3>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  @{activeConversation.partnerHandle} •{' '}
                  {activeConversation.isOnline ? (
                    <span className="text-emerald-400 font-semibold">En ligne</span>
                  ) : (
                    <span className="text-neutral-400">
                      Hors ligne {activeConversation.lastSeen ? `(${activeConversation.lastSeen})` : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Presence simulation toggle */}
              <button
                id="btn-toggle-online-presence"
                onClick={() => handleToggleOnlineStatus(activeConversation.id)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors flex items-center gap-1.5 ${
                  activeConversation.isOnline
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                }`}
                title="Cliquer pour changer le statut de présence de cet artiste (En ligne / Hors ligne)"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeConversation.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                  }`}
                />
                <span>{activeConversation.isOnline ? 'En ligne' : 'Hors ligne'}</span>
              </button>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                🔒 Privé
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {/* Disclaimer notice */}
            <div className="text-center my-2 space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full bg-neutral-900/90 border border-[#25F4EE]/40 text-[#25F4EE] font-medium">
                🔒 Discussion 100% privée avec @{activeConversation.partnerHandle}
              </span>
              <p className="text-[9.5px] text-neutral-400">
                Messages privés et confidentiels. Seuls toi et cet utilisateur avez accès à cette conversation.
              </p>
            </div>

            {/* Offline Alert when attempted to chat while offline */}
            {offlineNotice && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span>{offlineNotice}</span>
              </div>
            )}

            {/* Offline persistent note if partner is offline */}
            {!activeConversation.isOnline && (
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                  @{activeConversation.partnerHandle} est actuellement hors ligne. Il ne pourra pas te répondre avant sa reconnexion.
                </span>
              </div>
            )}

            {activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.isMe
                      ? 'bg-gradient-to-r from-[#FE2C55] to-[#f43f5e] text-white rounded-br-xs'
                      : 'bg-[#1c202d] text-neutral-100 border border-neutral-800 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-neutral-500 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isMe && (
                    <CheckCheck
                      className={`w-3 h-3 ${
                        activeConversation.isOnline ? 'text-[#25F4EE]' : 'text-neutral-500'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isPartnerTyping && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs py-1 px-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE] animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE] animate-bounce delay-200" />
                </div>
                <span className="text-[11px] font-medium text-neutral-300">
                  @{activeConversation.partnerHandle} est en train d'écrire...
                </span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-t border-neutral-800/40 bg-[#0e1017]">
            {quickSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 transition-colors border border-neutral-700/50"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 border-t border-neutral-800 bg-[#141722] flex items-center gap-2">
            <input
              type="text"
              id="input-chat-message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Écrire à ${activeConversation.partnerName.split(' ')[0]}...`}
              className="flex-1 bg-[#1e2230] border border-neutral-700/70 rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
            />
            <button
              id="btn-send-message"
              onClick={() => handleSendMessage()}
              disabled={!messageInput.trim()}
              className={`p-2.5 rounded-full transition-all ${
                messageInput.trim()
                  ? 'bg-[#FE2C55] text-white shadow-md hover:bg-[#e0264b] active:scale-90'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Conversation list and Notifications list */
        <div className="w-full h-full flex flex-col max-w-xl mx-auto px-3 pt-3 overflow-hidden">
          {/* Main Top Switcher: Messages vs Notifications */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 shrink-0">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span>Boîte de Réception</span>
            </h1>

            <button
              id="btn-new-chat"
              onClick={() => setIsNewChatModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#25F4EE]" />
              <span>Écrire à un artiste</span>
            </button>
          </div>

          {/* Subtabs Bar */}
          <div className="grid grid-cols-2 gap-2 my-2.5 shrink-0">
            <button
              id="tab-sub-messages"
              onClick={() => setActiveSubTab('messages')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'messages'
                  ? 'bg-[#FE2C55] text-white shadow-md'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-[#FE2C55] text-[10px] font-black">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              id="tab-sub-notifs"
              onClick={() => setActiveSubTab('notifications')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'notifications'
                  ? 'bg-[#25F4EE] text-black shadow-md'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotifsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#FE2C55] text-white text-[10px] font-black">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: MESSAGES LIST */}
          {activeSubTab === 'messages' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search in conversations */}
              <div className="relative mb-2.5 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une discussion artistique..."
                  className="w-full bg-[#161822] border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55]"
                />
              </div>

              {/* Conversations scroll area */}
              <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
                {conversations
                  .filter(
                    (c) =>
                      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.partnerHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((conv) => (
                    <div
                      key={conv.id}
                      id={`conv-item-${conv.id}`}
                      onClick={() => {
                        // Mark as read
                        onUpdateConversations(
                          conversations.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                        );
                        setActiveConversationId(conv.id);
                      }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#141722] hover:bg-[#1b1f2e] border border-neutral-800/70 hover:border-neutral-700 cursor-pointer transition-all active:scale-98"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.partnerAvatar}
                          alt={conv.partnerName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#141722] ${
                            conv.isOnline ? 'bg-emerald-500' : 'bg-neutral-500'
                          }`}
                          title={conv.isOnline ? 'En ligne' : 'Hors ligne'}
                        />
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FE2C55] ring-2 ring-[#0d0f14]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {conv.partnerName}
                          </h3>
                          <span className="text-[10px] text-neutral-400 shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] truncate">
                          <span className="text-[#25F4EE] font-medium">{conv.partnerRole}</span>
                          <span className="text-neutral-600">•</span>
                          <span
                            className={
                              conv.isOnline ? 'text-emerald-400 font-bold' : 'text-neutral-500'
                            }
                          >
                            {conv.isOnline ? 'En ligne' : 'Hors ligne'}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate mt-0.5 ${
                            conv.unreadCount > 0 ? 'text-white font-semibold' : 'text-neutral-400'
                          }`}
                        >
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}

                {conversations.length === 0 && (
                  <div className="text-center py-12 text-neutral-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                    <p className="font-semibold text-sm">Aucune discussion en cours</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Appuie sur "Écrire à un artiste" pour démarrer une collaboration !
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS LIST */}
          {activeSubTab === 'notifications' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter pills & Mark as read */}
              <div className="flex items-center justify-between gap-2 mb-2.5 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setNotifFilter('all')}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                      notifFilter === 'all'
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    onClick={() => setNotifFilter('collab')}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                      notifFilter === 'collab'
                        ? 'bg-[#FE2C55] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Collabs 🤝
                  </button>
                  <button
                    onClick={() => setNotifFilter('likes')}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                      notifFilter === 'likes'
                        ? 'bg-[#25F4EE] text-black font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Likes & Retours ❤️
                  </button>
                </div>

                {unreadNotifsCount > 0 && (
                  <button
                    onClick={handleMarkAllNotifsAsRead}
                    className="text-[10px] text-neutral-400 hover:text-white whitespace-nowrap"
                  >
                    Tout lire
                  </button>
                )}
              </div>

              {/* Notifications scroll area */}
              <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      onUpdateNotifications(
                        notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                      );
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      !notif.read
                        ? 'bg-[#181d2a] border-[#25F4EE]/40'
                        : 'bg-[#131620] border-neutral-800/70 opacity-80'
                    }`}
                  >
                    {/* Icon indicator */}
                    <div className="shrink-0 relative">
                      {notif.avatar ? (
                        <img
                          src={notif.avatar}
                          alt="Avatar"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FE2C55] to-[#25F4EE] flex items-center justify-center text-white">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center">
                        {notif.type === 'like' && <Heart className="w-2.5 h-2.5 text-[#FE2C55] fill-current" />}
                        {notif.type === 'follow' && <UserPlus className="w-2.5 h-2.5 text-[#25F4EE]" />}
                        {notif.type === 'collab_request' && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                        {notif.type === 'comment' && <MessageSquare className="w-2.5 h-2.5 text-emerald-400" />}
                        {notif.type === 'trend' && <TrendingUp className="w-2.5 h-2.5 text-purple-400" />}
                      </div>
                    </div>

                    {/* Notif Body */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">{notif.title}</h4>
                      <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                        {notif.description}
                      </p>
                      <span className="text-[9px] text-neutral-500 mt-1 block">
                        {notif.timeAgo}
                      </span>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FE2C55] shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NEW CHAT MODAL: Pick an artist */}
      {isNewChatModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setIsNewChatModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#161824] rounded-3xl p-4 border border-neutral-800 text-white max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-[#25F4EE]" />
                <span>Contacter un créateur ado</span>
              </h3>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-neutral-400 my-2">
              Sélectionne un artiste dans la communauté pour entamer une conversation privée :
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => handleStartNewChat(artist)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d2130] hover:bg-[#252a3d] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{artist.name}</h4>
                      <p className="text-[10px] text-neutral-400">@{artist.handle} • {artist.age}</p>
                      <p className="text-[10px] text-[#25F4EE]">{artist.role}</p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded-lg bg-[#FE2C55] text-white text-[10px] font-bold">
                    Écrire
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
