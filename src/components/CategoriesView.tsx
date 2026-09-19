import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Palette,
  Film,
  Brush,
  BookOpen,
  Headphones,
  Hammer,
  Box,
  TrendingUp,
  PlayCircle,
  Users,
  PenTool,
  Flame,
  Layers,
  Scissors,
  Camera,
  Activity,
  Feather
} from 'lucide-react';
import { ArtCategory } from '../types';

interface CategoriesViewProps {
  categories: ArtCategory[];
  onSelectCategoryFeed: (categoryId: string) => void;
  onExploreArtists: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onSelectCategoryFeed,
  onExploreArtists,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Map icon names to lucide components
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Film':
        return <Film className="w-5 h-5" />;
      case 'Brush':
        return <Brush className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5" />;
      case 'Box':
        return <Box className="w-5 h-5" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Feather':
        return <Feather className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const domainTabs = [
    { id: 'all', label: 'Toutes les catégories' },
    { id: 'visuel', label: '🎨 Arts Visuels' },
    { id: 'plastique', label: '🗿 Arts Plastiques' },
    { id: 'numerique', label: '💻 Arts Numériques' },
    { id: 'applique', label: '✂️ Arts Appliqués' },
    { id: 'sonore', label: '🎵 Arts Sonores' },
    { id: 'vivant', label: '💃 Arts Vivants' },
    { id: 'narratif', label: '📖 Arts Narratifs' },
  ];

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.popularTags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === 'all' || cat.domain === selectedDomain;
    const matchesTag = selectedTag ? cat.popularTags.includes(selectedTag) : true;
    return matchesSearch && matchesDomain && matchesTag;
  });

  const allTags = Array.from(new Set(categories.flatMap((c) => c.popularTags))).slice(0, 10);

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto pb-24 pt-4 px-4 select-none no-scrollbar">
      {/* Top Header */}
      <div className="max-w-xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Toutes les Catégories d'Art</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FE2C55] text-white font-bold">
                {categories.length} Disciplines
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Arts visuels, plastiques, numériques, vivants, appliqués & narratifs
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            id="input-search-categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher sculpture, manga, aquarelle, céramique, 3D..."
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

        {/* Art Domain Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mt-2">
          {domainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedDomain(tab.id);
                setSelectedTag(null);
              }}
              className={`text-[11px] px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                selectedDomain === tab.id
                  ? 'bg-[#25F4EE] text-black shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Popular Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mt-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
              selectedTag === null
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Tous les tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-[#FE2C55] text-white font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            id={`category-card-${category.id}`}
            className="group relative rounded-2xl overflow-hidden bg-[#161922] border border-neutral-800/90 hover:border-neutral-700 transition-all duration-200 shadow-md flex flex-col"
          >
            {/* Visual Cover Header */}
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={category.coverImage}
                alt={category.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#161922] via-[#161922]/50 to-transparent"
              />
              {/* Category Icon Badge */}
              <div
                className="absolute top-2.5 left-3 p-2 rounded-xl text-white shadow-lg backdrop-blur-md"
                style={{ backgroundColor: `${category.color}CC` }}
              >
                {renderIcon(category.iconName)}
              </div>

              {/* Stats Badge */}
              <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#25F4EE]" />
                <span>{category.postCount} clips</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-wide flex items-center justify-between">
                  <span>{category.name}</span>
                </h2>
                <p className="text-xs text-neutral-400 font-medium mt-0.5">
                  {category.subtitle}
                </p>
                <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {category.popularTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3.5 pt-2 border-t border-neutral-800">
                <button
                  id={`btn-feed-${category.id}`}
                  onClick={() => onSelectCategoryFeed(category.id)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white text-xs font-semibold shadow-sm transition-transform active:scale-95"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Voir flux</span>
                </button>

                <button
                  id={`btn-artists-${category.id}`}
                  onClick={() => onExploreArtists(category.id)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-[#25F4EE]" />
                  <span>Artistes ({category.artistsCount})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 max-w-sm mx-auto text-neutral-400">
          <Palette className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
          <p className="font-semibold text-base text-neutral-200">Aucune catégorie trouvée</p>
          <p className="text-xs text-neutral-500 mt-1">
            Essaie avec d'autres mots-clés comme "manga", "aquarelle" ou "blender".
          </p>
        </div>
      )}
    </div>
  );
};
