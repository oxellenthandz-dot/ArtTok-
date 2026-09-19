import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Sparkles,
  Search,
  CheckCircle2,
  Send,
  MessageSquare,
  ExternalLink,
  Shield,
  Lock,
  ArrowRight,
  Check,
  Palette,
  Briefcase,
  PenTool,
  Edit2
} from 'lucide-react';
import { CollaborationArtist } from '../types';

interface CollaborationViewProps {
  artists: CollaborationArtist[];
  userArtistProfile: CollaborationArtist | null;
  onRegisterArtist: (artist: CollaborationArtist) => void;
  targetArtistHandle?: string | null;
  onClearTargetArtist?: () => void;
  onNavigateToMessages?: (artist: CollaborationArtist, initialMessage?: string) => void;
}

export const CollaborationView: React.FC<CollaborationViewProps> = ({
  artists,
  userArtistProfile,
  onRegisterArtist,
  targetArtistHandle,
  onClearTargetArtist,
  onNavigateToMessages,
}) => {
  // Two explicit sections as requested by user
  const [activeSubSection, setActiveSubSection] = useState<'search' | 'register'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Tous');
  const [collabProposalArtist, setCollabProposalArtist] = useState<CollaborationArtist | null>(null);
  const [proposalSentSuccess, setProposalSentSuccess] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: userArtistProfile?.name || 'Artiste Ado',
    handle: userArtistProfile?.handle || 'mon_art_ado',
    age: userArtistProfile?.age || '16 ans',
    role: userArtistProfile?.role || 'Dessinateur Manga & Character Designer',
    category: userArtistProfile?.category || 'Manga & Webtoon',
    bio:
      userArtistProfile?.bio ||
      'Passionné de dessin manga, création d\'univers et narration visuelle. Hâte de lancer un projet duo !',
    skills: userArtistProfile?.skills.join(', ') || 'Encrage numérique, Character Design, Storyboard',
    lookingFor:
      userArtistProfile?.lookingFor ||
      'Un scénariste motivé pour écrire un manga fantastique de 30 pages.',
    tools: userArtistProfile?.tools.join(', ') || 'Clip Studio Paint, iPad Pro, Procreate',
    portfolioSampleTitle: userArtistProfile?.portfolioSamples[0]?.title || 'Mon illustration phare',
    portfolioSampleImage:
      userArtistProfile?.portfolioSamples[0]?.image ||
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    instagram: '@mon_art_ado',
    discord: 'mon_art#1234',
  });

  // Collaboration proposal state
  const [proposalData, setProposalData] = useState({
    projectTitle: '',
    format: 'Webtoon / Manga',
    message: '',
  });

  const roles = [
    'Tous',
    'Dessinateur',
    'Scénariste',
    'Animateur',
    'Beatmaker',
    'Coloriste',
    'Sculpteur',
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.handle.trim() || !formData.lookingFor.trim()) {
      alert('Merci de remplir au moins ton nom, ton pseudo et ce que tu recherches !');
      return;
    }

    const cleanHandle = formData.handle.replace('@', '').trim();
    const skillsArray = formData.skills
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Création originale', 'Passionné'];
    const toolsArray = formData.tools
      ? formData.tools.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Logiciel favori'];

    const newArtist: CollaborationArtist = {
      id: userArtistProfile ? userArtistProfile.id : `artist-user-${Date.now()}`,
      name: formData.name.trim(),
      handle: cleanHandle,
      avatar:
        userArtistProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      age: formData.age,
      role: formData.role,
      category: formData.category,
      bio: formData.bio.trim(),
      skills: skillsArray,
      lookingFor: formData.lookingFor.trim(),
      availableForCollab: true,
      tools: toolsArray,
      portfolioSamples: [
        {
          title: formData.portfolioSampleTitle || 'Création originale',
          image: formData.portfolioSampleImage,
          type: 'Illustration',
        },
      ],
      socials: {
        instagram: formData.instagram ? `@${formData.instagram.replace('@', '')}` : undefined,
        discord: formData.discord || undefined,
      },
      registeredDate: userArtistProfile?.registeredDate || 'Aujourd\'hui',
      collabProjectsCount: userArtistProfile?.collabProjectsCount || 0,
    };

    onRegisterArtist(newArtist);
    // Switch to search view now that user is registered
    setActiveSubSection('search');
  };

  const handleSendCollabProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalData.projectTitle.trim() || !proposalData.message.trim()) {
      alert('Veuillez remplir le titre et un message pour l\'artiste.');
      return;
    }

    setProposalSentSuccess(true);
    const targetArtist = collabProposalArtist;

    setTimeout(() => {
      setProposalSentSuccess(false);
      setCollabProposalArtist(null);
      setProposalData({ projectTitle: '', format: 'Webtoon / Manga', message: '' });

      // If messages callback is provided, route directly to chat!
      if (onNavigateToMessages && targetArtist) {
        onNavigateToMessages(
          targetArtist,
          `Demande de collaboration [${proposalData.projectTitle} - ${proposalData.format}] : ${proposalData.message}`
        );
      }
    }, 1500);
  };

  // Filtered artists (excluding self if already registered)
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.lookingFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'Tous'
        ? true
        : artist.role.toLowerCase().includes(selectedRoleFilter.toLowerCase());

    const matchesTarget = targetArtistHandle
      ? artist.handle.toLowerCase() === targetArtistHandle.toLowerCase()
      : true;

    return matchesSearch && matchesRole && matchesTarget;
  });

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto pb-24 pt-4 px-3 select-none no-scrollbar">
      <div className="max-w-xl mx-auto space-y-3.5">
        {/* Top Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#25F4EE]" />
              <span>Collaboration Artistes</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Trouve ton binôme artistique ado pour créer des projets d'art en duo
            </p>
          </div>
        </div>

        {/* 2 EXPLICIT SECTIONS REQUIRED BY USER */}
        {/* 1: Recherche des collaborateurs | 2: M'inscrire en collaboration */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#141722] rounded-2xl border border-neutral-800">
          <button
            id="tab-collab-search"
            onClick={() => setActiveSubSection('search')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubSection === 'search'
                ? 'bg-gradient-to-r from-[#25F4EE] to-[#0ea5e9] text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Recherche des collaborateurs</span>
          </button>

          <button
            id="tab-collab-register"
            onClick={() => setActiveSubSection('register')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubSection === 'register'
                ? 'bg-gradient-to-r from-[#FE2C55] to-[#f43f5e] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {userArtistProfile ? 'Mon Inscription (Inscrit ✅)' : "M'inscrire en collaboration"}
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: RECHERCHE DES COLLABORATEURS (AVEC CONTRÔLE D'ACCÈS STRICT)   */}
        {/* Seuls les gens qui ont été inscrits dans collaboration peuvent voir       */}
        {/* ========================================================================= */}
        {activeSubSection === 'search' && (
          <div className="space-y-3.5">
            {/* GATING CHECK: USER NOT REGISTERED */}
            {!userArtistProfile ? (
              <div
                id="collab-locked-notice"
                className="p-6 rounded-3xl bg-gradient-to-b from-[#181d2a] to-[#12141c] border border-[#FE2C55]/40 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FE2C55]/20 border border-[#FE2C55]/40 flex items-center justify-center text-[#FE2C55] mb-3 shadow-lg">
                  <Lock className="w-8 h-8" />
                </div>

                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] border border-[#FE2C55]/30 inline-block mb-2">
                  Accès Réservé aux Artistes Inscrits
                </span>

                <h2 className="text-xl font-black text-white">
                  Inscris-toi pour voir les autres créateurs
                </h2>

                <p className="text-xs text-neutral-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Sur ArtTok, la collaboration repose sur la réciprocité et la bienveillance :{' '}
                  <strong>seuls les artistes qui se sont inscrits dans l'onglet collaboration</strong>{' '}
                  ont accès à l'annuaire complet et peuvent découvrir et contacter les autres membres.
                </p>

                {/* Trust & Safety Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-5 text-left">
                  <div className="p-2.5 rounded-xl bg-[#0f1118] border border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#25F4EE] mb-0.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Sécurité Ado</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Uniquement des ados passionnés vérifiés dans l'annuaire.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f1118] border border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FE2C55] mb-0.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Réciprocité</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Partage ce que tu cherches pour qu'on puisse aussi te trouver.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f1118] border border-neutral-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Duos Créatifs</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Manga, webtoon, animations, crafts & musiques originales.
                    </p>
                  </div>
                </div>

                <button
                  id="btn-switch-to-register"
                  onClick={() => setActiveSubSection('register')}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FE2C55] to-[#f43f5e] hover:opacity-90 text-white font-bold text-xs shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>M'inscrire en collaboration pour débloquer l'annuaire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* GATING PASSED: USER IS REGISTERED AND CAN SEE ALL ARTISTS */
              <>
                {/* Active Membership Banner */}
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={userArtistProfile.avatar}
                      alt={userArtistProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {userArtistProfile.name} (@{userArtistProfile.handle})
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                          Profil visible
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                        {userArtistProfile.role} • Recherche : {userArtistProfile.lookingFor}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSubSection('register')}
                    className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs flex items-center gap-1"
                    title="Modifier mes critères"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Target artist active filter alert (e.g. from feed shortcut) */}
                {targetArtistHandle && (
                  <div className="p-2.5 rounded-xl bg-[#25F4EE]/10 border border-[#25F4EE]/30 flex items-center justify-between text-xs text-[#25F4EE]">
                    <span>
                      Artiste ciblé : <strong>@{targetArtistHandle}</strong>
                    </span>
                    <button
                      onClick={onClearTargetArtist}
                      className="text-white bg-neutral-800 px-2 py-0.5 rounded text-[11px]"
                    >
                      Voir tous les artistes
                    </button>
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    id="input-search-artists"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Recherche par style, manga, scénario, animation, beatmaker..."
                    className="w-full bg-[#181b24] border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Role Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRoleFilter(role)}
                      className={`text-[11px] px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-all ${
                        selectedRoleFilter === role
                          ? 'bg-[#FE2C55] text-white font-bold shadow-sm'
                          : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Artists Cards List */}
                <div className="space-y-3">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist.id}
                      id={`artist-card-${artist.handle}`}
                      className="p-4 rounded-2xl bg-[#161822] border border-neutral-800/90 hover:border-neutral-700 transition-all shadow-md flex flex-col justify-between space-y-3"
                    >
                      {/* Artist Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-white">{artist.name}</h3>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                                {artist.age}
                              </span>
                            </div>
                            <p className="text-xs text-[#25F4EE] font-semibold">{artist.role}</p>
                            <p className="text-[11px] text-neutral-400">@{artist.handle}</p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          Disponible
                        </span>
                      </div>

                      {/* Bio & Looking For */}
                      <p className="text-xs text-neutral-200 leading-relaxed">{artist.bio}</p>

                      <div className="p-2.5 rounded-xl bg-[#11131a] border border-neutral-800/80">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#FE2C55]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Recherche pour collaborer :</span>
                        </div>
                        <p className="text-xs text-neutral-200 mt-0.5 font-medium">
                          {artist.lookingFor}
                        </p>
                      </div>

                      {/* Skills & Tools */}
                      <div className="flex flex-wrap gap-1">
                        {artist.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {artist.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 font-medium border border-neutral-800"
                          >
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>

                      {/* Portfolio Sample Preview */}
                      {artist.portfolioSamples.length > 0 && (
                        <div className="relative h-28 w-full rounded-xl overflow-hidden group">
                          <img
                            src={artist.portfolioSamples[0].image}
                            alt={artist.portfolioSamples[0].title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-2 text-xs font-bold text-white drop-shadow">
                            🎨 {artist.portfolioSamples[0].title}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/80">
                        <button
                          id={`btn-collab-${artist.handle}`}
                          onClick={() => setCollabProposalArtist(artist)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white text-xs font-bold transition-all active:scale-95 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Proposer un projet</span>
                        </button>

                        <button
                          id={`btn-chat-${artist.handle}`}
                          onClick={() => {
                            if (onNavigateToMessages) {
                              onNavigateToMessages(
                                artist,
                                `Salut ${artist.name} ! J'ai vu ton profil dans la section collaboration d'ArtTok.`
                              );
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#25F4EE]" />
                          <span>Discuter</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredArtists.length === 0 && (
                    <div className="text-center py-12 text-neutral-400">
                      <Users className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                      <p className="font-semibold text-sm">Aucun collaborateur trouvé</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Essaie de modifier tes critères ou choisis "Tous" dans les rôles.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: M'INSCRIRE EN COLLABORATION (FORMULAIRE COMPLET & TRANSPARENT) */}
        {/* ========================================================================= */}
        {activeSubSection === 'register' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-[#141722] border border-neutral-800 shadow-xl space-y-4">
            <div className="border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-[#FE2C55] font-black text-sm uppercase tracking-wider">
                <UserPlus className="w-4 h-4" />
                <span>
                  {userArtistProfile
                    ? 'Mon Profil Actif dans la Collaboration'
                    : "Formulaire d'inscription Artiste Ado"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                {userArtistProfile
                  ? 'Modifie ou prévisualise tes informations de collaboration'
                  : 'Rejoins le réseau d\'artistes et deviens visible pour les collaborations'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Une fois inscrit, ton profil apparaîtra dans l'annuaire pour que les autres créateurs puissent te proposer des duos.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Nom ou Pseudo d'artiste *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Yuna Art, Léo M..."
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Handle @identifiant *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="mon_pseudo_art"
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Âge</label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
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
                    Rôle principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ex: Dessinateur Manga, Scénariste, Beatmaker..."
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Ce que tu recherches précisément pour collaborer *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  placeholder="Ex: Je cherche un scénariste pour un Webtoon Shonen de 5 chapitres OU un beatmaker pour habiller mes speedpaints..."
                  className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Bio artistique (Présentation)
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Parle de tes inspirations, ton style, ton univers favori..."
                  className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Compétences (séparées par virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Encrage, Storyboard, Colorisation, Décors..."
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Outils & Médiums utilisés
                  </label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder="Clip Studio, Procreate, Argile, Blender..."
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Image d'illustration (Portfolio)
                </label>
                <input
                  type="url"
                  value={formData.portfolioSampleImage}
                  onChange={(e) => setFormData({ ...formData, portfolioSampleImage: e.target.value })}
                  placeholder="URL d'une image représentative..."
                  className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Instagram (facultatif)
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@mon_instagram"
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Discord (facultatif)
                  </label>
                  <input
                    type="text"
                    value={formData.discord}
                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                    placeholder="pseudo#0000"
                    className="w-full bg-[#1c202d] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-submit-registration"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:opacity-95 text-white font-black text-xs shadow-xl transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>
                    {userArtistProfile
                      ? 'Mettre à jour mon profil de collaboration'
                      : 'Valider mon inscription et débloquer les collaborateurs 🚀'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* PROPOSAL MODAL */}
      {collabProposalArtist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setCollabProposalArtist(null)}
        >
          <div
            className="w-full max-w-md bg-[#161824] rounded-3xl p-5 border border-neutral-800 text-white max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FE2C55]" />
                <span>Proposer un projet à {collabProposalArtist.name}</span>
              </h3>
              <button
                onClick={() => setCollabProposalArtist(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            {proposalSentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-white">Demande envoyée avec succès !</h4>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                  {collabProposalArtist.name} recevra une notification et pourra te répondre directement dans la section Messages.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendCollabProposal} className="space-y-3 mt-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Titre du projet / concept *
                  </label>
                  <input
                    type="text"
                    required
                    value={proposalData.projectTitle}
                    onChange={(e) =>
                      setProposalData({ ...proposalData, projectTitle: e.target.value })
                    }
                    placeholder="Ex: Webtoon Cyberpunk, Crossover de nos héros..."
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Format</label>
                  <select
                    value={proposalData.format}
                    onChange={(e) => setProposalData({ ...proposalData, format: e.target.value })}
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  >
                    <option value="Webtoon / Manga">Webtoon / Planches Manga</option>
                    <option value="Animation 2D / Sakuga">Animation 2D / Sakuga</option>
                    <option value="Speedpaint + OST Beatmaking">Speedpaint + OST Beatmaking</option>
                    <option value="Sculpture / Diorama duo">Sculpture / Diorama duo</option>
                    <option value="Scénario & Storyboard">Scénario & Storyboard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Ton message d'introduction *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposalData.message}
                    onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                    placeholder="Présente ton idée en quelques lignes et ce que tu souhaites faire ensemble..."
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-confirm-send-proposal"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:opacity-95 text-white font-bold text-xs shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la proposition de collaboration</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
