import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Film,
  Image as ImageIcon,
  Camera,
  Radio,
  Scroll,
  Check,
  RotateCcw,
  Zap,
  Clock,
  Play,
  Pause,
  AlertCircle,
  FolderOpen,
  Send,
  Heart,
  Users,
  Eye,
  StopCircle,
  Video
} from 'lucide-react';
import { ArtVideoPost, ArtCategory, StoryScenario } from '../types';

type CreationMode = 'camera' | 'gallery' | 'live' | 'scenario';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ArtCategory[];
  onAddPost: (post: ArtVideoPost) => void;
  onAddScenario?: (scenario: StoryScenario) => void;
  initialMode?: CreationMode;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddPost,
  onAddScenario,
  initialMode = 'camera',
}) => {
  const [activeMode, setActiveMode] = useState<CreationMode>(initialMode);

  // Common Post Meta
  const [caption, setCaption] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'manga-webtoon');
  const [hashtags, setHashtags] = useState('#ArtTok #AdoArtiste #CreationOriginale');
  const [tools, setTools] = useState('Tablette graphique, Clip Studio');
  const [collabNotice, setCollabNotice] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. CAMERA STATE
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraSubMode, setCameraSubMode] = useState<'photo' | 'video'>('photo');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // 2. GALLERY STATE
  const [galleryPermissionGranted, setGalleryPermissionGranted] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<'image' | 'video'>('image');
  const [selectedPresetImage, setSelectedPresetImage] = useState(
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 3. LIVE STATE
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('Encrage manga & Speedpaint en direct 🎨');
  const [liveViewersCount, setLiveViewersCount] = useState(248);
  const [liveHearts, setLiveHearts] = useState<number[]>([]);
  const [liveMessages, setLiveMessages] = useState<{ id: string; user: string; text: string }[]>([
    { id: '1', user: 'Maya', text: 'Incroyable le line art !' },
    { id: '2', user: 'Léo3D', text: 'Tu utilises quelle taille de plume ?' },
    { id: '3', user: 'Sakura', text: 'Trop stylé bon live 🔥' },
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');

  // 4. SCENARIO STATE
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [scenarioGenre, setScenarioGenre] = useState('Shōnen & Aventure');
  const [scenarioFormat, setScenarioFormat] = useState<'Manga' | 'Webtoon' | 'Court-Métrage' | 'BD Franco-Belge' | 'Animation'>('Manga');
  const [scenarioTagline, setScenarioTagline] = useState('');
  const [scenarioSynopsis, setScenarioSynopsis] = useState('');
  const [scenarioCharacter, setScenarioCharacter] = useState('Kaito (16 ans, lycéen capable de matérialiser ses croquis)');
  const [scenarioCollabNeed, setScenarioCollabNeed] = useState('Cherche dessinateur/coloriste motivé');

  // Handle active stream cleanup on unmount or tab change
  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setIsLiveActive(false);
    }
  }, [isOpen]);

  // Request Camera & Microphone Permission
  const requestCameraAccess = async (facing: 'user' | 'environment' = cameraFacing) => {
    stopCameraStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: true,
      });
      setCameraStream(stream);
      setCameraPermission('granted');
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Erreur accès caméra:', err);
      setCameraPermission('denied');
    }
  };

  // Switch Camera Front / Back
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    requestCameraAccess(nextFacing);
  };

  // Capture Photo Snapshot
  const capturePhoto = () => {
    if (!videoPreviewRef.current) return;
    const video = videoPreviewRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhotoUrl(dataUrl);
      setSelectedPresetImage(dataUrl);
      stopCameraStream();
    }
  };

  // Start Video Recording
  const startVideoRecording = () => {
    if (!cameraStream) return;
    recordedChunksRef.current = [];
    try {
      const recorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Erreur MediaRecorder:', err);
    }
  };

  // Stop Video Recording
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopCameraStream();
    }
  };

  // Handle Gallery file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');
    setUploadedMediaUrl(fileUrl);
    setUploadedMediaType(isVideo ? 'video' : 'image');
    if (!isVideo) {
      setSelectedPresetImage(fileUrl);
    }
  };

  // Simulated Live stream loop
  useEffect(() => {
    let interval: any;
    if (isLiveActive) {
      interval = setInterval(() => {
        setLiveViewersCount((prev) => Math.max(120, prev + Math.floor(Math.random() * 7) - 3));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLiveActive]);

  const handleSendLiveMessage = () => {
    if (!liveChatInput.trim()) return;
    setLiveMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, user: 'Moi (Créateur)', text: liveChatInput.trim() },
    ]);
    setLiveChatInput('');
  };

  const handleTriggerLiveHeart = () => {
    setLiveHearts((prev) => [...prev, Date.now()]);
    setTimeout(() => {
      setLiveHearts((prev) => prev.slice(1));
    }, 1500);
  };

  // SUBMIT POST
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      alert('Veuillez ajouter une description pour votre œuvre.');
      return;
    }

    const matchedCategory = categories.find((c) => c.id === categoryId);
    const finalPoster = capturedPhotoUrl || uploadedMediaUrl || selectedPresetImage;

    const newPost: ArtVideoPost = {
      id: `post-user-${Date.now()}`,
      creatorId: 'user-self',
      creatorName: 'Toi (Artiste)',
      creatorHandle: 'mon_art_ado',
      creatorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      creatorAge: '16 ans',
      creatorRole: 'Artiste Émergent',
      isVerifiedTeen: true,
      categoryId,
      categoryName: matchedCategory?.name || 'Manga & Webtoon',
      caption: caption.trim(),
      hashtags: hashtags.split(' ').filter((h) => h.startsWith('#')),
      videoUrl: recordedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      artworkPoster: finalPoster,
      soundTitle: 'Original ArtTok Vibe',
      soundArtist: 'Artiste Ado Studio',
      soundCover: finalPoster,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isLiked: true,
      isBookmarked: false,
      isFollowing: true,
      artTools: tools.split(',').map((t) => t.trim()),
      collaborationNotice: collabNotice.trim() ? `🤝 ${collabNotice.trim()}` : undefined,
      comments: [],
    };

    setSuccessMessage('Création artistique publiée sur ArtTok ! 🚀');
    setIsSuccess(true);
    setTimeout(() => {
      onAddPost(newPost);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  // SUBMIT SCENARIO
  const handleSubmitScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioTitle.trim() || !scenarioSynopsis.trim()) {
      alert('Veuillez remplir au moins le titre et le synopsis de votre histoire.');
      return;
    }

    const newScenario: StoryScenario = {
      id: `scenario-${Date.now()}`,
      title: scenarioTitle.trim(),
      tagline: scenarioTagline.trim() || 'Histoire originale écrite sur ArtTok Studio',
      synopsis: scenarioSynopsis.trim(),
      genre: scenarioGenre,
      author: {
        name: 'Toi (Auteur)',
        handle: 'mon_art_ado',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        age: '16 ans',
        role: 'Scénariste & Storyboarder',
      },
      targetFormat: scenarioFormat,
      status: 'Recherche Dessinateur',
      tags: ['#ScenarioAdo', `#${scenarioGenre.split(' ')[0]}`, '#ArtTok'],
      likesCount: 1,
      commentsCount: 0,
      collaboratorsNeeded: [scenarioCollabNeed || 'Dessinateur', 'Coloriste'],
      createdAt: 'À l’instant',
      panels: [
        {
          order: 1,
          title: 'Scène 1 - Introduction',
          visualNotes: 'Plan d’ouverture cinématographique sur la ville au crépuscule.',
          dialogue: '« Tout a commencé ce jour-là... »',
        },
      ],
    };

    if (onAddScenario) {
      onAddScenario(newScenario);
    }

    setSuccessMessage('Scénario publié dans l’onglet Scénarios & Histoires ! 📖');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#141620] rounded-3xl border border-neutral-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-[#191c28]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FE2C55]" />
            <h2 className="text-base font-extrabold text-white">Studio de Création ArtTok</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 CREATION MODES TABS (Caméra, Galerie, Live Direct, Scénario) */}
        <div className="grid grid-cols-4 p-1.5 bg-[#0f111a] border-b border-neutral-800/80 text-xs font-bold">
          {/* Tab 1: Caméra */}
          <button
            id="create-tab-camera"
            onClick={() => {
              setActiveMode('camera');
              if (cameraPermission !== 'granted') {
                requestCameraAccess();
              }
            }}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              activeMode === 'camera'
                ? 'bg-[#FE2C55] text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-[11px]">Caméra</span>
          </button>

          {/* Tab 2: Galerie */}
          <button
            id="create-tab-gallery"
            onClick={() => {
              setActiveMode('gallery');
              stopCameraStream();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              activeMode === 'gallery'
                ? 'bg-[#25F4EE] text-black shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-[11px]">Galerie</span>
          </button>

          {/* Tab 3: Live Direct */}
          <button
            id="create-tab-live"
            onClick={() => {
              setActiveMode('live');
              requestCameraAccess();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              activeMode === 'live'
                ? 'bg-[#FF0050] text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-[11px]">Direct / Live</span>
          </button>

          {/* Tab 4: Scénario & Histoire */}
          <button
            id="create-tab-scenario"
            onClick={() => {
              setActiveMode('scenario');
              stopCameraStream();
            }}
            className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
              activeMode === 'scenario'
                ? 'bg-[#9D4EDD] text-white shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span className="text-[11px]">Scénario</span>
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="py-16 text-center space-y-3 px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">{successMessage}</h3>
            <p className="text-xs text-neutral-300">
              C'est en ligne et prêt à être partagé avec tous les créateurs d'ArtTok.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* ============================================================== */}
            {/* 1. MODE CAMÉRA (Photo & Vidéo avec autorisation d'accès caméra) */}
            {/* ============================================================== */}
            {activeMode === 'camera' && (
              <div className="space-y-4">
                {/* Camera Permission Prompt Card (if not granted) */}
                {cameraPermission !== 'granted' && (
                  <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FE2C55]/20 text-[#FE2C55] flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Autorisation d'accès Caméra & Micro</h4>
                      <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto">
                        Pour filmer des vidéos artistiques ou photographier tes créations en direct, autorise l'accès à la caméra de ton appareil.
                      </p>
                    </div>
                    <button
                      id="btn-request-camera-permission"
                      type="button"
                      onClick={() => requestCameraAccess()}
                      className="px-5 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
                    >
                      Autoriser l'accès à la caméra 📷
                    </button>
                    {cameraPermission === 'denied' && (
                      <p className="text-[11px] text-amber-400 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Accès caméra refusé. Vérifie les autorisations de ton navigateur ou utilise la Galerie.
                      </p>
                    )}
                  </div>
                )}

                {/* Viewfinder Preview */}
                <div className="relative aspect-[9/16] max-h-[380px] bg-black rounded-2xl overflow-hidden mx-auto border-2 border-neutral-700 shadow-inner flex items-center justify-center">
                  {cameraStream ? (
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : capturedPhotoUrl ? (
                    <img
                      src={capturedPhotoUrl}
                      alt="Capture"
                      className="w-full h-full object-cover"
                    />
                  ) : recordedVideoUrl ? (
                    <video
                      src={recordedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <Video className="w-10 h-10 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-400">Viseur Caméra en attente d'activation</p>
                    </div>
                  )}

                  {/* Top Viewfinder Controls */}
                  {cameraStream && (
                    <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-xs text-xs">
                      <button
                        onClick={toggleCameraFacing}
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                        title="Basculer caméra avant/arrière"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {isRecording && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>00:{recordTimer < 10 ? `0${recordTimer}` : recordTimer}</span>
                        </div>
                      )}

                      <span className="text-[10px] text-white/80 font-medium">
                        {cameraSubMode === 'photo' ? 'Photo HD' : 'Vidéo 1080p'}
                      </span>
                    </div>
                  )}

                  {/* Bottom Viewfinder Action Bar */}
                  {cameraStream && (
                    <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-2 z-10">
                      {/* Submode Switcher: PHOTO | VIDÉO */}
                      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setCameraSubMode('photo')}
                          className={`transition-colors ${
                            cameraSubMode === 'photo' ? 'text-[#25F4EE]' : 'text-neutral-400'
                          }`}
                        >
                          PHOTO
                        </button>
                        <span className="text-neutral-600">|</span>
                        <button
                          type="button"
                          onClick={() => setCameraSubMode('video')}
                          className={`transition-colors ${
                            cameraSubMode === 'video' ? 'text-[#FE2C55]' : 'text-neutral-400'
                          }`}
                        >
                          VIDÉO
                        </button>
                      </div>

                      {/* Shutter Button */}
                      {cameraSubMode === 'photo' ? (
                        <button
                          id="btn-take-photo"
                          type="button"
                          onClick={capturePhoto}
                          className="w-14 h-14 rounded-full border-4 border-white bg-white/30 hover:bg-white/50 flex items-center justify-center transition-transform active:scale-90 shadow-xl"
                          title="Prendre une photo"
                        >
                          <div className="w-10 h-10 rounded-full bg-white" />
                        </button>
                      ) : !isRecording ? (
                        <button
                          id="btn-start-record-video"
                          type="button"
                          onClick={startVideoRecording}
                          className="w-14 h-14 rounded-full border-4 border-white bg-red-600/30 flex items-center justify-center transition-transform active:scale-90 shadow-xl"
                          title="Enregistrer une vidéo"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FE2C55]" />
                        </button>
                      ) : (
                        <button
                          id="btn-stop-record-video"
                          type="button"
                          onClick={stopVideoRecording}
                          className="w-14 h-14 rounded-full border-4 border-white bg-red-600 flex items-center justify-center transition-transform active:scale-90 shadow-xl animate-pulse"
                          title="Arrêter l'enregistrement"
                        >
                          <StopCircle className="w-6 h-6 text-white" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Reset captured media button */}
                  {(capturedPhotoUrl || recordedVideoUrl) && !cameraStream && (
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhotoUrl(null);
                        setRecordedVideoUrl(null);
                        requestCameraAccess();
                      }}
                      className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/70 hover:bg-black text-white text-xs font-medium border border-neutral-700 flex items-center gap-1 z-10"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reprendre</span>
                    </button>
                  )}
                </div>

                {/* Form fields to finalize publish */}
                <form onSubmit={handleSubmitPost} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Catégorie d'art
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FE2C55]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Légende / Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Décris ta photo ou ta vidéo, le matériel utilisé, tes inspirations..."
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Outils & Matériel
                      </label>
                      <input
                        type="text"
                        value={tools}
                        onChange={(e) => setTools(e.target.value)}
                        placeholder="Ex: Copic markers, iPad..."
                        className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#FE2C55] block mb-1">
                        Cherche une Collab ?
                      </label>
                      <input
                        type="text"
                        value={collabNotice}
                        onChange={(e) => setCollabNotice(e.target.value)}
                        placeholder="Ex: Cherche scénariste..."
                        className="w-full bg-[#1b1e2c] border border-[#FE2C55]/40 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn-publish-camera-post"
                    className="w-full py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#e0264b] text-white font-bold text-xs shadow-lg transition-transform active:scale-98"
                  >
                    Publier ma création sur ArtTok 🚀
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* 2. MODE GALERIE (Autorisation & Téléversement de photos/vidéos) */}
            {/* ============================================================== */}
            {activeMode === 'gallery' && (
              <div className="space-y-4">
                {/* Gallery Permission & Direct Access Request Card */}
                {!galleryPermissionGranted ? (
                  <div className="p-4 rounded-2xl bg-neutral-900/90 border border-[#25F4EE]/30 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#25F4EE]/20 text-[#25F4EE] flex items-center justify-center mx-auto">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Autorisation d'accès à la Galerie</h4>
                      <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto">
                        Autorise ArtTok à accéder à la galerie de photos et vidéos de ton appareil pour téléverser tes œuvres.
                      </p>
                    </div>
                    <button
                      id="btn-request-gallery-permission"
                      type="button"
                      onClick={() => {
                        setGalleryPermissionGranted(true);
                        fileInputRef.current?.click();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#25F4EE] hover:bg-[#1fd3ce] text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
                    >
                      Autoriser et Ouvrir ma Galerie 🖼️
                    </button>
                  </div>
                ) : (
                  /* Gallery file upload dropzone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#25F4EE]/50 hover:border-[#25F4EE] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-neutral-900/40"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-[#25F4EE] mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">
                      Clique pour téléverser une photo ou vidéo depuis ta galerie
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Formats acceptés : PNG, JPG, MP4, WEBM (Glisser-déposer supporté)
                    </p>
                  </div>
                )}

                {/* Uploaded media preview */}
                {uploadedMediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden max-h-52 bg-black border border-neutral-700">
                    {uploadedMediaType === 'video' ? (
                      <video src={uploadedMediaUrl} controls className="w-full max-h-52 object-contain" />
                    ) : (
                      <img src={uploadedMediaUrl} alt="Uploaded" className="w-full max-h-52 object-contain" />
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[10px] font-bold">
                      ✓ Fichier galerie importé
                    </span>
                  </div>
                )}

                {/* Quick preset artwork selection */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Ou choisis une œuvre artistique de notre collection :
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      {
                        title: 'Manga Encrage',
                        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80',
                      },
                      {
                        title: 'Digital Painting',
                        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
                      },
                      {
                        title: 'Sakuga Anime',
                        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
                      },
                      {
                        title: 'Aquarelle',
                        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&auto=format&fit=crop&q=80',
                      },
                    ].map((art, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedPresetImage(art.url);
                          setUploadedMediaUrl(art.url);
                        }}
                        className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedPresetImage === art.url
                            ? 'border-[#25F4EE] scale-105'
                            : 'border-neutral-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={art.url}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form fields for Gallery Post */}
                <form onSubmit={handleSubmitPost} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Catégorie d'art *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Légende / Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Présente ton œuvre importée depuis ta galerie..."
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-publish-gallery-post"
                    className="w-full py-2.5 rounded-xl bg-[#25F4EE] hover:bg-[#1fd3ce] text-black font-bold text-xs shadow-lg transition-transform active:scale-98"
                  >
                    Publier l'œuvre de ma galerie sur ArtTok 🚀
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* 3. CASE FAIRE DES LIVES / DIRECTS (En Direct)                 */}
            {/* ============================================================== */}
            {activeMode === 'live' && (
              <div className="space-y-4">
                {!isLiveActive ? (
                  /* Live Setup Screen */
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-tr from-neutral-900 to-[#1e1020] border border-red-500/30 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto animate-pulse">
                        <Radio className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-extrabold text-white">Lancer un Direct / Live d'Art</h4>
                      <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                        Dessine en direct, partage tes techniques d'animation ou discute de tes scénarios avec la communauté adolescente d'ArtTok en temps réel.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Titre du Live en Direct *
                      </label>
                      <input
                        type="text"
                        value={liveTitle}
                        onChange={(e) => setLiveTitle(e.target.value)}
                        placeholder="Ex: Speedpaint manga en direct & conseils encrage"
                        className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Thème artistique
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      id="btn-start-live-studio"
                      type="button"
                      onClick={() => setIsLiveActive(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-[#FE2C55] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-95 transition-transform active:scale-98"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Démarrer le Direct (GO LIVE) 🔴</span>
                    </button>
                  </div>
                ) : (
                  /* Active Live Room View */
                  <div className="relative aspect-[9/16] max-h-[460px] bg-neutral-950 rounded-2xl overflow-hidden border-2 border-red-500 shadow-2xl flex flex-col justify-between p-3">
                    {/* Live Stream Viewfinder */}
                    {cameraStream ? (
                      <video
                        ref={(el) => {
                          if (el && cameraStream) {
                            el.srcObject = cameraStream;
                            el.play().catch(() => {});
                          }
                        }}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&auto=format&fit=crop&q=80"
                        alt="Live Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

                    {/* Top Live Bar: LIVE Badge, Viewers count, End button */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center gap-1.5 animate-pulse shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>EN DIRECT</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 border border-white/20">
                          <Users className="w-3.5 h-3.5 text-[#25F4EE]" />
                          <span>{liveViewersCount}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsLiveActive(false);
                          alert(`Direct terminé ! ${liveViewersCount} spectateurs ont suivi votre session live d'art.`);
                        }}
                        className="px-3 py-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors"
                      >
                        Terminer le direct
                      </button>
                    </div>

                    {/* Live Floating Hearts Overlay */}
                    <div className="absolute right-4 bottom-24 z-20 pointer-events-none flex flex-col items-center">
                      {liveHearts.map((id) => (
                        <div
                          key={id}
                          className="animate-float-heart text-[#FE2C55] text-2xl font-bold"
                        >
                          ❤️
                        </div>
                      ))}
                    </div>

                    {/* Bottom Live Chat & Interaction Bar */}
                    <div className="relative z-10 space-y-2">
                      <div className="max-h-36 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
                        {liveMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs text-white inline-block max-w-[90%]"
                          >
                            <span className="text-[#25F4EE] font-bold mr-1.5">{msg.user}:</span>
                            <span>{msg.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input Bar */}
                      <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                        <input
                          type="text"
                          value={liveChatInput}
                          onChange={(e) => setLiveChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendLiveMessage();
                          }}
                          placeholder="Répondre au direct..."
                          className="flex-1 bg-transparent px-3 py-1 text-xs text-white placeholder-neutral-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleTriggerLiveHeart}
                          className="p-1.5 rounded-full text-[#FE2C55] hover:scale-110 active:scale-90 transition-transform"
                          title="Envoyer un cœur"
                        >
                          <Heart className="w-5 h-5 fill-[#FE2C55]" />
                        </button>
                        <button
                          type="button"
                          onClick={handleSendLiveMessage}
                          className="p-1.5 rounded-full bg-[#FE2C55] text-white hover:opacity-90 active:scale-90 transition-transform"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* 4. CASE ÉCRIRE DES SCÉNARIOS ET DES HISTOIRES                */}
            {/* ============================================================== */}
            {activeMode === 'scenario' && (
              <form onSubmit={handleSubmitScenario} className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#9D4EDD]/20 to-[#25F4EE]/10 border border-[#9D4EDD]/30 flex items-center gap-2.5">
                  <Scroll className="w-6 h-6 text-[#9D4EDD] shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Écriture de Scénario & Histoire</h4>
                    <p className="text-[11px] text-neutral-300">
                      Publie tes synopsis, pitchs et arcs narratifs pour trouver un dessinateur ou coloriste partenaire.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Titre du Scénario / de l'Histoire *
                  </label>
                  <input
                    required
                    type="text"
                    value={scenarioTitle}
                    onChange={(e) => setScenarioTitle(e.target.value)}
                    placeholder="Ex: Les Chroniques de l'Éclipse, Âmes de Papier..."
                    className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#9D4EDD]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Genre
                    </label>
                    <select
                      value={scenarioGenre}
                      onChange={(e) => setScenarioGenre(e.target.value)}
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="Shōnen & Action">Shōnen & Action</option>
                      <option value="Webtoon Dark Fantasy">Webtoon Dark Fantasy</option>
                      <option value="Cyberpunk & Sci-Fi">Cyberpunk & Sci-Fi</option>
                      <option value="Tranche de vie & Romance">Tranche de vie & Romance</option>
                      <option value="Enquête & Mystère">Enquête & Mystère</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Format Cible
                    </label>
                    <select
                      value={scenarioFormat}
                      onChange={(e) => setScenarioFormat(e.target.value as any)}
                      className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="Manga">Manga</option>
                      <option value="Webtoon">Webtoon</option>
                      <option value="Court-Métrage">Court-Métrage</option>
                      <option value="Animation">Animation</option>
                      <option value="BD Franco-Belge">BD Franco-Belge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Accroche / Tagline en une phrase
                  </label>
                  <input
                    type="text"
                    value={scenarioTagline}
                    onChange={(e) => setScenarioTagline(e.target.value)}
                    placeholder="Ex: Dans un monde où les ombres prennent vie..."
                    className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Synopsis détaillé & Intrigue principale *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={scenarioSynopsis}
                    onChange={(e) => setScenarioSynopsis(e.target.value)}
                    placeholder="Raconte l'univers, le conflit initial, les enjeux des héros et la fin du premier chapitre..."
                    className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#9D4EDD]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Personnage Principal
                  </label>
                  <input
                    type="text"
                    value={scenarioCharacter}
                    onChange={(e) => setScenarioCharacter(e.target.value)}
                    placeholder="Nom, âge, pouvoir ou particularité"
                    className="w-full bg-[#1b1e2c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9D4EDD] block mb-1">
                    Collaborateurs recherchés
                  </label>
                  <input
                    type="text"
                    value={scenarioCollabNeed}
                    onChange={(e) => setScenarioCollabNeed(e.target.value)}
                    placeholder="Ex: Cherche dessinateur shonen pour storyboarder le chapitre 1"
                    className="w-full bg-[#1b1e2c] border border-[#9D4EDD]/40 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-publish-scenario"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9D4EDD] to-[#7B2CBF] text-white font-bold text-xs shadow-lg transition-transform active:scale-98"
                >
                  Publier le Scénario dans la Communauté 📖
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
