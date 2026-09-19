import React from 'react';
import {
  Home,
  LayoutGrid,
  Plus,
  Scroll,
  Users,
  MessageSquare,
  User
} from 'lucide-react';
import { MainTabType } from '../types';

interface BottomNavBarProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  onOpenCreate: (mode?: 'camera' | 'gallery' | 'live' | 'scenario') => void;
  isUserRegisteredForCollab?: boolean;
  unreadCount?: number;
  userAvatar?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  onOpenCreate,
  isUserRegisteredForCollab = false,
  unreadCount = 0,
  userAvatar,
}) => {
  return (
    <nav
      id="bottom-nav-bar"
      className="absolute bottom-0 inset-x-0 h-14 bg-[#090b10]/98 backdrop-blur-lg border-t border-neutral-800/90 flex items-center justify-between px-1 z-40 select-none text-white"
    >
      {/* 1. ACCUEIL (Feed) */}
      <button
        id="nav-tab-feed"
        onClick={() => onChangeTab('feed')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'feed'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Home
          className={`w-5 h-5 ${
            activeTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'feed' ? 'font-bold text-white' : 'font-medium'
          }`}
        >
          Accueil
        </span>
      </button>

      {/* 2. CATÉGORIES (Toutes les catégories d'art) */}
      <button
        id="nav-tab-categories"
        onClick={() => onChangeTab('categories')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'categories'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <LayoutGrid
          className={`w-5 h-5 ${
            activeTab === 'categories' ? 'stroke-[2.5] text-[#25F4EE]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'categories' ? 'font-bold text-[#25F4EE]' : 'font-medium'
          }`}
        >
          Catégories
        </span>
      </button>

      {/* 3. COLLABORATION (Hub avec Inscription & Recherche) */}
      <button
        id="nav-tab-collaboration"
        onClick={() => onChangeTab('collaboration')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'collaboration'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <Users
            className={`w-5 h-5 ${
              activeTab === 'collaboration'
                ? 'stroke-[2.5] text-[#FE2C55]'
                : 'stroke-[1.8]'
            }`}
          />
          {/* Badge: if not registered, small alert dot; if registered, green dot */}
          {!isUserRegisteredForCollab ? (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FE2C55] ring-2 ring-black animate-pulse"
              title="Inscription requise pour voir les autres"
            />
          ) : (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black"
              title="Inscrit en collaboration"
            />
          )}
        </div>
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'collaboration'
              ? 'font-bold text-[#FE2C55]'
              : 'font-medium'
          }`}
        >
          Collab
        </span>
      </button>

      {/* 4. ICONIC TIKTOK CENTER [+] BUTTON */}
      <div className="flex items-center justify-center px-0.5">
        <button
          id="nav-btn-create"
          onClick={() => onOpenCreate('camera')}
          className="relative group transition-transform active:scale-90 flex items-center justify-center"
          title="Créer : Caméra, Galerie, Live Direct ou Scénario"
          aria-label="Créer"
        >
          {/* TikTok Dual Cyan/Magenta Glow layers */}
          <div className="w-9 h-7 rounded-lg bg-[#25F4EE] absolute -left-0.8 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="w-9 h-7 rounded-lg bg-[#FE2C55] absolute -right-0.8 opacity-90 group-hover:opacity-100 transition-opacity" />

          {/* White center button */}
          <div className="relative w-8.5 h-7 rounded-lg bg-white flex items-center justify-center text-black shadow-md z-10">
            <Plus className="w-4.5 h-4.5 stroke-[3] text-black" />
          </div>
        </button>
      </div>

      {/* 5. SCÉNARIO ET HISTOIRE */}
      <button
        id="nav-tab-scenario"
        onClick={() => onChangeTab('scenario')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'scenario'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Scroll
          className={`w-5 h-5 ${
            activeTab === 'scenario' ? 'stroke-[2.5] text-[#9D4EDD]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'scenario' ? 'font-bold text-[#9D4EDD]' : 'font-medium'
          }`}
        >
          Scénarios
        </span>
      </button>

      {/* 6. MESSAGES (Boîte de réception & Notifications) */}
      <button
        id="nav-tab-messages"
        onClick={() => onChangeTab('messages')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'messages'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <MessageSquare
            className={`w-5 h-5 ${
              activeTab === 'messages' ? 'stroke-[2.5] text-[#25F4EE]' : 'stroke-[1.8]'
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full bg-[#FE2C55] text-white text-[9px] font-extrabold min-w-3.5 text-center leading-tight">
              {unreadCount}
            </span>
          )}
        </div>
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'messages' ? 'font-bold text-[#25F4EE]' : 'font-medium'
          }`}
        >
          Messages
        </span>
      </button>

      {/* 7. PROFIL (Mon profil, vidéos postées, republiées, abonnés, abonnements) */}
      <button
        id="nav-tab-profile"
        onClick={() => onChangeTab('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'profile'
            ? 'text-white'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        {userAvatar ? (
          <div
            className={`w-5 h-5 rounded-full overflow-hidden border ${
              activeTab === 'profile' ? 'border-white ring-1 ring-[#FE2C55]' : 'border-neutral-600'
            }`}
          >
            <img
              src={userAvatar}
              alt="Profil"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <User
            className={`w-5 h-5 ${
              activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        )}
        <span
          className={`text-[9px] mt-0.5 tracking-tight ${
            activeTab === 'profile' ? 'font-bold text-white' : 'font-medium'
          }`}
        >
          Profil
        </span>
      </button>
    </nav>
  );
};
