import { useState } from 'react';
import {
  Search, Home, Grid3x3, Download, Heart, User, Play,
  Eye, ThumbsUp, Share2, Download as DownloadIcon, X,
  Menu, ChevronRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  views: number;
  category: string;
  duration: string;
  description: string;
  isDownloaded?: boolean;
  downloadProgress?: number;
}

const VIDEOS: Video[] = [
  {
    id: 1,
    title: "The Future of Technology",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop",
    views: 145000,
    category: "Education",
    duration: "12:45",
    description: "Explore the cutting edge of modern technology and innovation."
  },
  {
    id: 2,
    title: "Epic Comedy Moments",
    thumbnail: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&h=300&fit=crop",
    views: 892000,
    category: "Comedy",
    duration: "8:30",
    description: "Hilarious moments that will make you laugh out loud."
  },
  {
    id: 3,
    title: "Sports Highlights 2024",
    thumbnail: "https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=400&h=300&fit=crop",
    views: 523000,
    category: "Sports",
    duration: "15:20",
    description: "Best sports moments from the year."
  },
  {
    id: 4,
    title: "Music Beats",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
    views: 1200000,
    category: "Music",
    duration: "4:15",
    description: "Amazing music production and performances."
  },
  {
    id: 5,
    title: "News Today",
    thumbnail: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop",
    views: 234000,
    category: "News",
    duration: "6:00",
    description: "Today's top news stories."
  },
  {
    id: 6,
    title: "Entertainment Buzz",
    thumbnail: "https://images.unsplash.com/photo-1489599849228-ed4dc59b2e9a?w=400&h=300&fit=crop",
    views: 567000,
    category: "Entertainment",
    duration: "7:45",
    description: "Latest entertainment news and celebrity updates."
  },
];

const CATEGORIES = [
  "All",
  "Movies",
  "Music",
  "Comedy",
  "Sports",
  "News",
  "Education",
  "Entertainment"
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'categories' | 'downloads' | 'favorites' | 'profile'>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [downloads, setDownloads] = useState<{ [key: number]: Video }>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});

  const handleDownload = (video: Video) => {
    if (downloads[video.id]) return;

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloads(prev => ({ ...prev, [video.id]: video }));
        setDownloadProgress(prev => ({ ...prev, [video.id]: 100 }));
      }
      setDownloadProgress(prev => ({ ...prev, [video.id]: Math.min(progress, 100) }));
    }, 500);
  };

  const handleRemoveDownload = (videoId: number) => {
    setDownloads(prev => {
      const newDownloads = { ...prev };
      delete newDownloads[videoId];
      return newDownloads;
    });
  };

  const toggleFavorite = (videoId: number) => {
    setFavorites(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const filteredVideos = VIDEOS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteVideos = VIDEOS.filter(v => favorites.includes(v.id));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-foreground" />
          <h1 className="text-xl font-bold text-primary-foreground">Francois Free Watch</h1>
        </div>
        {currentPage === 'home' && (
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 flex-1 ml-4">
            <Search className="w-4 h-4 text-primary-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-primary-foreground placeholder-white/60 outline-none flex-1 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {currentPage === 'home' && !selectedVideo && (
          <div className="space-y-6 p-4">
            {/* Featured Video */}
            <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-br from-primary/50 to-orange-600/50 cursor-pointer group"
              onClick={() => setSelectedVideo(VIDEOS[0])}>
              <img
                src={VIDEOS[0].thumbnail}
                alt="Featured"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white font-bold text-sm">Featured</p>
                <p className="text-white/90 text-xs">{VIDEOS[0].title}</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Categories</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Latest Videos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Latest Videos</h2>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredVideos.map(video => (
                  <div
                    key={video.id}
                    className="rounded-lg overflow-hidden bg-card cursor-pointer group"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative h-28 bg-muted overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-primary line-clamp-1">{video.category}</p>
                      <p className="text-sm font-bold line-clamp-2 text-foreground">{video.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3" />
                        {(video.views / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Detail Page */}
        {currentPage === 'home' && selectedVideo && (
          <div className="space-y-4 p-4">
            <button
              onClick={() => setSelectedVideo(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <X className="w-5 h-5" />
              Back
            </button>

            {/* Video Player */}
            <div className="relative rounded-lg overflow-hidden h-56 bg-black">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-16 h-16 text-primary" />
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-primary uppercase">{selectedVideo.category}</p>
                <h2 className="text-2xl font-bold text-foreground">{selectedVideo.title}</h2>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {(selectedVideo.views / 1000).toFixed(0)}K views
                </span>
                <span>{selectedVideo.duration}</span>
              </div>

              <p className="text-sm text-foreground/80">{selectedVideo.description}</p>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => toggleFavorite(selectedVideo.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                    favorites.includes(selectedVideo.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border border-border'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedVideo.id) ? 'fill-current' : ''}`} />
                  Like
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-card text-foreground border border-border hover:bg-card/80 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => handleDownload(selectedVideo)}
                  disabled={downloads[selectedVideo.id] !== undefined}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <DownloadIcon className="w-5 h-5" />
                  {downloads[selectedVideo.id] ? 'Done' : 'Download'}
                </button>
              </div>

              {/* Download Progress */}
              {downloadProgress[selectedVideo.id] && downloadProgress[selectedVideo.id] < 100 && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${downloadProgress[selectedVideo.id]}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Downloading... {Math.round(downloadProgress[selectedVideo.id])}%
                  </p>
                </div>
              )}

              {/* Related Videos */}
              <div className="pt-4 space-y-3">
                <h3 className="font-bold text-foreground">Related Videos</h3>
                <div className="space-y-2">
                  {VIDEOS.filter(v => v.id !== selectedVideo.id && v.category === selectedVideo.category).slice(0, 3).map(video => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="flex gap-3 p-2 rounded-lg bg-card hover:bg-card/80 cursor-pointer transition-colors"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Downloads Page */}
        {currentPage === 'downloads' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">My Downloads</h2>
            {Object.keys(downloads).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Download className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-semibold">No downloads yet</p>
                <p className="text-sm text-muted-foreground">Download videos to watch offline</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Object.values(downloads).map(video => (
                  <div key={video.id} className="rounded-lg overflow-hidden bg-card">
                    <div className="relative h-28 bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveDownload(video.id)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-primary">{video.category}</p>
                      <p className="text-sm font-bold line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Page */}
        {currentPage === 'categories' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.filter(c => c !== 'All').map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage('home');
                  }}
                  className="p-6 rounded-lg bg-gradient-to-br from-primary to-orange-600 text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Page */}
        {currentPage === 'favorites' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Favorites</h2>
            {favoriteVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-semibold">No favorites yet</p>
                <p className="text-sm text-muted-foreground">Like videos to add them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {favoriteVideos.map(video => (
                  <div
                    key={video.id}
                    className="rounded-lg overflow-hidden bg-card cursor-pointer"
                    onClick={() => {
                      setSelectedVideo(video);
                      setCurrentPage('home');
                    }}
                  >
                    <div className="relative h-28 bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <Play className="absolute inset-0 m-auto w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-primary">{video.category}</p>
                      <p className="text-sm font-bold line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Page */}
        {currentPage === 'profile' && (
          <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Guest User</p>
                  <p className="text-sm text-muted-foreground">Sign in to save your progress</p>
                </div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In / Sign Up
              </Button>

              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Stats</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{favoriteVideos.length}</p>
                    <p className="text-xs text-muted-foreground">Favorites</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{Object.keys(downloads).length}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary">{VIDEOS.length}</p>
                    <p className="text-xs text-muted-foreground">Videos</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <button className="w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors text-foreground">
                  Help & Support
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors text-destructive">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around">
        <button
          onClick={() => {
            setCurrentPage('home');
            setSelectedVideo(null);
            setSearchQuery('');
            setSelectedCategory('All');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'home'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentPage('categories')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'categories'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Grid3x3 className="w-6 h-6" />
          <span className="text-xs mt-1">Categories</span>
        </button>
        <button
          onClick={() => setCurrentPage('downloads')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'downloads'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Download className="w-6 h-6" />
          <span className="text-xs mt-1">Downloads</span>
        </button>
        <button
          onClick={() => setCurrentPage('favorites')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'favorites'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Favorites</span>
        </button>
        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            currentPage === 'profile'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
