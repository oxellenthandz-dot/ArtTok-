import React, { useState } from 'react';
import {
  BookOpen,
  Scroll,
  PlusCircle,
  Sparkles,
  Heart,
  MessageSquare,
  Users,
  Search,
  CheckCircle,
  X,
  Shuffle,
  ChevronRight,
  Send
} from 'lucide-react';
import { StoryScenario, StoryPanel } from '../types';

interface ScenariosViewProps {
  scenarios: StoryScenario[];
  onAddScenario: (scenario: StoryScenario) => void;
  onNavigateToCollab: (targetArtistHandle?: string) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  scenarios,
  onAddScenario,
  onNavigateToCollab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tous');
  const [activeStory, setActiveStory] = useState<StoryScenario | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  // Prompt Generator State
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // New Story Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newGenre, setNewGenre] = useState('Urban Fantasy & Shonen');
  const [newFormat, setNewFormat] = useState<'Manga' | 'Webtoon' | 'Animation' | 'BD Franco-Belge' | 'Court-Métrage'>('Webtoon');
  const [newCollaborators, setNewCollaborators] = useState('Dessinateur principal pour planches encrées');
  const [panel1Desc, setPanel1Desc] = useState('');
  const [panel1Dialogue, setPanel1Dialogue] = useState('');

  const genres = [
    'Tous',
    'Urban Fantasy',
    'Cyberpunk',
    'Tranche de vie',
    'Action & Shonen',
    'Mystère',
  ];

  const storyPrompts = [
    "Un lycéen découvre que chaque dessin qu'il efface de sa tablette graphique efface un souvenir douloureux de quelqu'un dans sa ville.",
    "Dans une académie de magie moderne, les sorts ne se lancent pas avec des baguettes mais avec des beats musicaux et des micros.",
    "Deux ados rivaux dans un club d'art découvrent qu'ils sont en réalité les deux créateurs anonymes du webtoon le plus populaire du pays sans le savoir.",
    "Une peintre de 16 ans a le don de peindre l'avenir exact dans 24 heures, mais chaque toile attire des entités invisibles.",
    "Dans un monde sous-marin post-apocalyptique, une mécanicienne et un jeune cartographe construisent un sous-marin pour retrouver le soleil."
  ];

  const handleGeneratePrompt = () => {
    const random = storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
    setGeneratedPrompt(random);
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedStories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSynopsis.trim()) {
      alert('Veuillez au moins remplir le titre et le synopsis de votre histoire.');
      return;
    }

    const createdStory: StoryScenario = {
      id: `story-custom-${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'Un projet original d\'un jeune auteur sur ArtTok.',
      synopsis: newSynopsis.trim(),
      genre: newGenre,
      author: {
        name: 'Toi (Auteur Ado)',
        handle: 'toi_scenariste',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        age: '16 ans',
        role: 'Scénariste & Concepteur',
      },
      targetFormat: newFormat,
      status: 'Recherche Dessinateur',
      tags: ['#ArtTokOriginal', `#${newFormat}`, '#NouveauProjet'],
      likesCount: 1,
      commentsCount: 0,
      collaboratorsNeeded: [newCollaborators.trim()],
      createdAt: 'À l\'instant',
      panels: [
        {
          order: 1,
          title: 'Case 1 d\'ouverture',
          visualNotes: panel1Desc.trim() || 'Première vue d\'ambiance cinématique du héros.',
          dialogue: panel1Dialogue.trim() || 'Le début d\'une aventure légendaire...',
        },
      ],
    };

    onAddScenario(createdStory);
    setIsCreateModalOpen(false);
    setActiveStory(createdStory);
    // Reset
    setNewTitle('');
    setNewTagline('');
    setNewSynopsis('');
    setPanel1Desc('');
    setPanel1Dialogue('');
  };

  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGenre =
      selectedGenre === 'Tous'
        ? true
        : s.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto pb-24 pt-4 px-4 select-none no-scrollbar">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Scroll className="w-6 h-6 text-[#9D4EDD]" />
              <span>Scénario & Histoire</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Écris, lis des scripts originaux et trouve un dessinateur pour ta BD ou ton Webtoon
            </p>
          </div>

          <button
            id="btn-create-story"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#9D4EDD] to-[#FE2C55] hover:opacity-95 text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Scénario</span>
          </button>
        </div>

        {/* Story Inspiration Box / Prompt Generator */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1b1527] to-[#161922] border border-[#9D4EDD]/30 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#9D4EDD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Générateur d'idées & d'accroches de scénario
            </span>
            <button
              onClick={handleGeneratePrompt}
              className="text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 bg-neutral-800/80 px-2 py-0.5 rounded-md border border-neutral-700"
            >
              <Shuffle className="w-3 h-3 text-[#25F4EE]" />
              Tirer une idée
            </button>
          </div>
          <p className="text-xs text-neutral-200 italic leading-relaxed">
            {generatedPrompt ||
              "Besoin d'inspiration pour ton prochain manga ou court-métrage ? Clique sur 'Tirer une idée' pour débloquer un concept original !"}
          </p>
          {generatedPrompt && (
            <button
              onClick={() => {
                setNewSynopsis(generatedPrompt);
                setIsCreateModalOpen(true);
              }}
              className="mt-2 text-[11px] text-[#FE2C55] font-semibold hover:underline"
            >
              Utiliser cette idée dans mon scénario →
            </button>
          )}
        </div>

        {/* Search and Genre Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="input-search-stories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un scénario, auteur, manga, cyberpunk..."
              className="w-full bg-[#181b24] border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#9D4EDD]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-[#9D4EDD] text-white font-bold'
                    : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios Grid / List */}
        <div className="space-y-3.5">
          {filteredScenarios.map((story) => {
            const isLiked = likedStories[story.id] || false;
            const currentLikes = isLiked ? story.likesCount + 1 : story.likesCount;

            return (
              <div
                key={story.id}
                id={`story-card-${story.id}`}
                onClick={() => setActiveStory(story)}
                className="p-4 rounded-2xl bg-[#161922] border border-neutral-800 hover:border-neutral-700 transition-all duration-200 shadow-md cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">
                          {story.author.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-[#25F4EE] font-medium border border-neutral-700">
                          {story.author.age}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {story.createdAt} • Format : <strong>{story.targetFormat}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] font-semibold border border-[#FE2C55]/30">
                    {story.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-white group-hover:text-[#25F4EE] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-[#9D4EDD] font-medium mt-0.5">
                    {story.tagline}
                  </p>
                  <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                    {story.synopsis}
                  </p>
                </div>

                {/* Collaborators Needed pill */}
                {story.collaboratorsNeeded.length > 0 && (
                  <div className="mt-3 p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                      <Users className="w-3.5 h-3.5 text-[#FE2C55]" />
                      <span>Recherche : <strong>{story.collaboratorsNeeded[0]}</strong></span>
                    </div>
                    <span className="text-xs text-[#25F4EE] font-semibold flex items-center">
                      Lire le script <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                )}

                {/* Footer with tags, likes, panels count */}
                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-medium">
                      {story.genre}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      • {story.panels.length} case{story.panels.length > 1 ? 's' : ''} découpée{story.panels.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleToggleLike(story.id, e)}
                      className="flex items-center gap-1 text-neutral-400 hover:text-white"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-[#FE2C55] text-[#FE2C55]' : ''
                        }`}
                      />
                      <span>{currentLikes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{story.commentsCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STORY DETAIL / SCRIPT READER MODAL */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="w-full max-w-xl bg-[#161823] rounded-3xl p-5 border border-neutral-800 text-white shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] font-bold border border-[#9D4EDD]/30">
                  {activeStory.genre} • {activeStory.targetFormat}
                </span>
                <h2 className="text-lg font-black text-white mt-1.5">
                  {activeStory.title}
                </h2>
                <p className="text-xs text-neutral-400">
                  Par <strong>{activeStory.author.name}</strong> (@{activeStory.author.handle}) • {activeStory.author.age}
                </p>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Synopsis Section */}
            <div className="my-4 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h4 className="text-xs font-bold text-[#25F4EE] uppercase tracking-wider mb-1">
                Synopsis complet
              </h4>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {activeStory.synopsis}
              </p>
            </div>

            {/* Collaborators Needed Call to Action */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FE2C55]/20 to-[#9D4EDD]/20 border border-[#FE2C55]/40 flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#FE2C55] uppercase block">
                  Recherche d'artistes pour ce projet :
                </span>
                <p className="text-xs text-white font-medium">
                  {activeStory.collaboratorsNeeded.join(', ')}
                </p>
              </div>
              <button
                id="btn-apply-collab-story"
                onClick={() => {
                  setActiveStory(null);
                  onNavigateToCollab(activeStory.author.handle);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white text-xs font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap ml-2"
              >
                Postuler / Collaborer →
              </button>
            </div>

            {/* Storyboard Panels Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-[#9D4EDD]" />
                Découpage & Script des cases ({activeStory.panels.length})
              </h4>

              <div className="space-y-3">
                {activeStory.panels.map((panel) => (
                  <div
                    key={panel.order}
                    className="p-3 rounded-xl bg-[#1c1f2c] border border-neutral-800"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#25F4EE] mb-1">
                      <span>Case #{panel.order} : {panel.title}</span>
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1.5">
                      <p>
                        <strong className="text-neutral-400">Description visuelle :</strong>{' '}
                        {panel.visualNotes}
                      </p>
                      {panel.dialogue && (
                        <p className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-200 italic font-mono text-[11px]">
                          💬 {panel.dialogue}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STORY MODAL */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#161823] rounded-3xl p-5 border border-neutral-800 text-white shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-[#9D4EDD]" />
                <h3 className="text-base font-bold">Publier un Scénario / Projet d'Histoire</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Titre de ton histoire *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Les Chroniques du Dernier Encreur"
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#9D4EDD]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Accroche en 1 phrase (Tagline)
                </label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="Ex: Quand un dessin efface le monde réel..."
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#9D4EDD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Genre
                  </label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9D4EDD]"
                  >
                    <option value="Urban Fantasy & Shonen">Urban Fantasy & Shonen</option>
                    <option value="Cyberpunk & Sci-Fi">Cyberpunk & Sci-Fi</option>
                    <option value="Dark Fantasy & Mystère">Dark Fantasy & Mystère</option>
                    <option value="Tranche de vie & Romance">Tranche de vie & Romance</option>
                    <option value="Aventure Épique">Aventure Épique</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Format visuel ciblé
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) =>
                      setNewFormat(
                        e.target.value as 'Manga' | 'Webtoon' | 'Animation' | 'BD Franco-Belge' | 'Court-Métrage'
                      )
                    }
                    className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9D4EDD]"
                  >
                    <option value="Webtoon">Webtoon vertical</option>
                    <option value="Manga">Manga noir & blanc</option>
                    <option value="Animation">Animation / Court-métrage</option>
                    <option value="BD Franco-Belge">BD couleur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Synopsis / Résumé de l'univers *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  placeholder="Raconte l'intrigue principale, les personnages phares et le défi à surmonter..."
                  className="w-full bg-[#1e2230] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#9D4EDD]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FE2C55] block mb-1">
                  Artistes recherchés pour collaborer
                </label>
                <input
                  type="text"
                  value={newCollaborators}
                  onChange={(e) => setNewCollaborators(e.target.value)}
                  placeholder="Ex: Dessinateur style anime + Coloriste"
                  className="w-full bg-[#1e2230] border border-[#FE2C55]/40 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55]"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-[#25F4EE]">
                  Case #1 (Exemple de découpage)
                </span>
                <input
                  type="text"
                  value={panel1Desc}
                  onChange={(e) => setPanel1Desc(e.target.value)}
                  placeholder="Description visuelle : plan large, héros qui court sous la pluie..."
                  className="w-full bg-[#161823] border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500"
                />
                <input
                  type="text"
                  value={panel1Dialogue}
                  onChange={(e) => setPanel1Dialogue(e.target.value)}
                  placeholder="Dialogue ou pensée : 'Je n'ai plus le choix...'"
                  className="w-full bg-[#161823] border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500"
                />
              </div>

              <button
                type="submit"
                id="btn-publish-story-submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9D4EDD] to-[#FE2C55] text-white font-bold text-xs shadow-lg transition-transform active:scale-98"
              >
                Publier mon scénario sur ArtTok 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
