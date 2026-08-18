import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Music, MailOpen, Volume2, Sparkles, Share2 } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { audioManager } from '../utils/audioManager';
import { createShareInvitationWhatsAppUrl } from '../utils/whatsapp';
import smp149Logo from '../assets/images/smp_149_logo_transparent.png';

interface HeaderHeroProps {
  onOpenInvitation: () => void;
  guestName: string;
  setGuestName: (name: string) => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  onOpenInvitation,
  guestName,
  setGuestName
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditingGuest, setIsEditingGuest] = useState(false);

  useEffect(() => {
    const unsub = audioManager.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return () => unsub();
  }, []);

  const handleOpen = () => {
    if (!isPlaying) {
      audioManager.play();
    }
    onOpenInvitation();
  };

  return (
    <header className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white px-4 py-16">
      {/* Top-Left Corner Standalone Emblem Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-auto"
      >
        <img
          id="logo-smpn-149-emblem"
          src={smp149Logo || '/images/smp_149_logo_transparent.png'}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.indexOf('/images/smp_149_logo.jpg') === -1) {
              target.src = '/images/smp_149_logo.jpg';
            }
          }}
          alt="Emblem Logo SMP Negeri 149 Alumni 2006"
          referrerPolicy="no-referrer"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer"
          title="SMP Negeri 149 Alumni 2006"
        />
      </motion.div>

      {/* Background Decorative Rings & Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse-gentle" />
        
        {/* Subtle geometric grid background */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        {/* Top Badge: SMP Negeri 149 Jakarta Timur */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium tracking-wide mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span className="font-semibold text-white">UNDANGAN RESMI ALUMNI 2006 SMP NEGERI 149 JAKARTA TIMUR</span>
        </motion.div>

        {/* Main Title with Elegant Serif & Display font */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="space-y-3 mb-8"
        >
          <p className="text-sky-300 font-serif italic text-lg sm:text-2xl tracking-wide">
            Reuni dan Temu Kangen
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
            Merajut Kenangan <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200">
              Putih Biru 149
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            "Kisah klasik di bangku sekolah, kehangatan persahabatan yang tak pernah lekang oleh waktu."
          </p>
        </motion.div>

        {/* Personalized Guest Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-block p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-left min-w-[280px] sm:min-w-[340px] max-w-md mx-auto">
            <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold mb-1">
              Kepada Yth.
            </p>
            {isEditingGuest ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ketik nama Anda..."
                  className="bg-white/20 text-white placeholder-blue-200 px-3 py-1.5 rounded-lg text-base font-semibold outline-none border border-blue-300/50 w-full focus:ring-2 focus:ring-blue-400"
                  autoFocus
                  onBlur={() => setIsEditingGuest(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingGuest(false)}
                />
                <button
                  onClick={() => setIsEditingGuest(false)}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs font-bold text-white transition-colors"
                >
                  Simpan
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => setIsEditingGuest(true)}
                title="Klik untuk ubah nama penerima"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-200 transition-colors">
                  {guestName || "Alumni 2006 SMPN 149"}
                </h2>
                <span className="text-xs text-blue-300 group-hover:text-white underline ml-2">
                  Ubah
                </span>
              </div>
            )}
            <p className="text-xs text-slate-300 mt-1">
              Kami mengundang Anda untuk hadir mempererat silaturahmi & bernostalgia bersama.
            </p>
          </div>
        </motion.div>

        {/* Quick Date, Time & Venue Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10 text-xs sm:text-sm font-medium"
        >
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span className="text-slate-200">{EVENT_DETAILS.date}</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-slate-200">{EVENT_DETAILS.time}</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="text-slate-200 font-semibold">{EVENT_DETAILS.venue}</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="btn-buka-undangan"
            onClick={handleOpen}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <MailOpen className="w-5 h-5 text-white" />
            <span>Buka Undangan Lengkap</span>
          </button>

          <a
            id="btn-share-hero"
            href={createShareInvitationWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Bagikan ke Grup WA</span>
          </a>
        </motion.div>

        {/* Audio prompt indicator */}
        <p className="text-[11px] sm:text-xs text-slate-300 mt-6 flex items-center justify-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Musik latar: <strong>Sheila On 7 - Memori Baik</strong> otomatis berputar saat Anda membuka undangan.</span>
        </p>
      </div>
    </header>
  );
};
