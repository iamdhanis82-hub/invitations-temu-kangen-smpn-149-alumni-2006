import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, VolumeX, Upload, Sparkles, X, 
  Disc3, RotateCcw, AlertCircle, Music2, Link2, Check
} from 'lucide-react';
import { audioManager, AudioState } from '../utils/audioManager';

export const MusicPlayerWidget: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(audioManager.getState());
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = audioManager.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    audioManager.togglePlay();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioManager.setCustomFile(file);
      setIsExpanded(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioManager.setVolume(val);
  };

  const handleToggleMute = () => {
    audioManager.toggleMute();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audioManager.seek(time);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      audioManager.setCustomUrl(customUrl.trim(), "Memori Baik", "Sheila On 7");
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  const handleResetToDefault = () => {
    audioManager.resetToDefaultFile();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const { isPlaying, trackName, artist, currentTime, duration, volume, isMuted, sourceType, hasError, errorMessage } = audioState;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl text-white w-72 sm:w-84"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Disc3 className={`w-5 h-5 text-sky-400 ${isPlaying ? 'animate-spin' : ''}`} />
                <span className="text-xs font-bold text-slate-200">Musik Latar Undangan</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Track Card */}
            <div className="space-y-1.5 mb-3.5 bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  Lagu Tema Reuni
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {sourceType === 'file' ? 'File: /audio' : sourceType === 'custom-file' ? 'File Unggahan' : 'Audio URL'}
                </span>
              </div>
              
              <div className="pt-0.5">
                <h5 className="text-sm font-bold text-white tracking-wide truncate">
                  {trackName}
                </h5>
                <p className="text-xs text-sky-300 font-medium">
                  {artist}
                </p>
              </div>

              {/* Progress Slider */}
              <div className="pt-2 space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime || 0}
                  onChange={handleSeek}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
                </div>
              </div>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-5 mb-3 bg-slate-950/60 rounded-xl px-4">
              {[30, 60, 90, 50, 100, 45, 85, 40, 95, 25].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-blue-500 to-sky-400 transition-all duration-200 ${
                    isPlaying ? 'opacity-100' : 'opacity-20 h-1.5'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(4, (h * (volume || 0.6)) / 3.5)}px` : '3px'
                  }}
                />
              ))}
            </div>

            {/* Fallback error notification if local file not found yet */}
            {hasError && (
              <div className="mb-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Sumber File MP3 Belum Tersedia</p>
                  <p className="text-[10px] text-amber-200/90 mt-0.5">
                    Silakan klik <strong>Unggah File MP3</strong> di bawah untuk memilih file lagu dari HP/Laptop Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <button
                  id="btn-music-play-pause"
                  onClick={handleTogglePlay}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'Jeda Lagu' : 'Putar Lagu'}</span>
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <Volume2 className="w-3.5 h-3.5" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[10px] w-6">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>

              {/* URL input field if toggled */}
              {showUrlInput && (
                <form onSubmit={handleApplyUrl} className="pt-2 border-t border-slate-800 flex items-center gap-1.5">
                  <input
                    type="url"
                    placeholder="https://.../lagu.mp3"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-[11px] border border-slate-700 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold"
                  >
                    Terapkan
                  </button>
                </form>
              )}

              {/* File Options */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <label className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah File MP3</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                  title="Gunakan Link URL MP3 Online"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>

                {sourceType !== 'file' && (
                  <button
                    onClick={handleResetToDefault}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                    title="Kembalikan ke file bawaan /audio/sheila-on-7-memori-baik.mp3"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* File placement hint */}
              <p className="text-[9px] text-slate-400 text-center pt-1 leading-tight">
                File sumber lokal bawaan: <span className="font-mono text-slate-300">/audio/sheila-on-7-memori-baik.mp3</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Toggle Button */}
      <motion.button
        id="btn-floating-music-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white font-bold text-xs shadow-2xl border border-blue-400/40 flex items-center gap-2.5 group"
      >
        <div className="relative">
          <Disc3 className={`w-5 h-5 text-sky-300 ${isPlaying ? 'animate-spin' : ''}`} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <div className="text-left">
          <span className="max-w-[120px] truncate block text-[11px] leading-tight font-bold">
            {isPlaying ? 'Memori Baik' : 'Musik Latar'}
          </span>
          <span className="text-[9px] text-sky-300 block leading-tight font-normal">
            Sheila On 7
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-blue-200">
          {isExpanded ? '▼' : '▲'}
        </span>
      </motion.button>
    </div>
  );
};
