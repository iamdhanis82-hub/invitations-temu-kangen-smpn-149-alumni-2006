import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, MapPin, Users, MessageSquareHeart, Camera, Phone, 
  Share2, Sparkles, ChevronUp, Bell, QrCode, Heart, School, 
  ExternalLink, MailOpen, Compass
} from 'lucide-react';
import { HeaderHero } from './components/HeaderHero';
import { CountdownTimer } from './components/CountdownTimer';
import { EventInfoSection } from './components/EventInfoSection';
import { LocationMapSection } from './components/LocationMapSection';
import { RsvpSection } from './components/RsvpSection';
import { GuestbookSection } from './components/GuestbookSection';
import { CommitteeContactSection } from './components/CommitteeContactSection';
import { MemoryGallery } from './components/MemoryGallery';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { EVENT_DETAILS } from './data/eventData';
import { RSVPData } from './types';
import { createShareInvitationWhatsAppUrl } from './utils/whatsapp';
import smp149Logo from './assets/images/smp_149_logo_transparent.png';

export default function App() {
  const [guestName, setGuestName] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to') || urlParams.get('nama') || urlParams.get('u');
    return toParam ? decodeURIComponent(toParam) : '';
  });

  const [rsvpData, setRsvpData] = useState<RSVPData | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mainContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenInvitation = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Sticky Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={smp149Logo}
              alt="Logo SMP Negeri 149"
              referrerPolicy="no-referrer"
              className="w-9 h-9 object-contain rounded-lg shadow-xs border border-blue-100"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base font-serif block leading-none">
                SMPN 149 Jakarta Timur
              </span>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wide">
                Reuni & Temu Kangen 2026
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#detail-acara" className="hover:text-blue-600 transition-colors">Acara</a>
            <a href="#lokasi-peta" className="hover:text-blue-600 transition-colors">Lokasi</a>
            <a href="#rsvp-kehadiran" className="hover:text-blue-600 transition-colors">RSVP</a>
            <a href="#buku-tamu" className="hover:text-blue-600 transition-colors">Buku Tamu</a>
            <a href="#galeri-kenangan" className="hover:text-blue-600 transition-colors">Galeri</a>
            <a href="#kontak-panitia" className="hover:text-blue-600 transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="nav-btn-pass"
              onClick={() => setIsPassModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">E-Pass Undangan</span>
            </button>

            <a
              id="nav-btn-share"
              href={createShareInvitationWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Cover Section with Personalization */}
      <HeaderHero
        onOpenInvitation={handleOpenInvitation}
        guestName={guestName}
        setGuestName={setGuestName}
      />

      {/* Main Content Anchor */}
      <div ref={mainContentRef}>
        {/* Countdown Timer Section */}
        <CountdownTimer onOpenReminderModal={() => setIsReminderModalOpen(true)} />

        {/* Detailed Event Info & Rundown Section */}
        <EventInfoSection />

        {/* Location & Google Maps Section */}
        <LocationMapSection />

        {/* RSVP Section */}
        <RsvpSection
          guestName={guestName}
          onRsvpSuccess={(data) => {
            setRsvpData(data);
            setIsPassModalOpen(true);
          }}
        />

        {/* Digital Guestbook Section */}
        <GuestbookSection guestName={guestName} />

        {/* Memory Gallery */}
        <MemoryGallery />

        {/* Committee & Contact Section */}
        <CommitteeContactSection />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center">
            <img
              src="/images/smp_149_logo_transparent.png"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.indexOf('/images/smp_149_logo.jpg') === -1) {
                  target.src = '/images/smp_149_logo.jpg';
                }
              }}
              alt="Emblem Logo SMP Negeri 149"
              className="w-16 h-16 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] mx-auto"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Keluarga Besar Alumni 2006 SMP Negeri 149 Jakarta Timur
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              "Sekolah mungkin telah usai, namun ikatan persaudaraan dan kenangan putih-biru akan selalu abadi di dalam hati."
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>📅 {EVENT_DETAILS.date}</span>
            <span>•</span>
            <span>📍 {EVENT_DETAILS.venue}</span>
            <span>•</span>
            <span>⏰ {EVENT_DETAILS.time}</span>
            <span>•</span>
            <span>👔 Putih Biru</span>
          </div>

          <div className="text-[11px] text-slate-500 pt-4">
            © 2026 Panitia Temu Kangen Reuni SMPN 149 Jakarta Timur. Dibuat dengan penuh kehangatan untuk seluruh alumni.
          </div>
        </div>
      </footer>

      {/* Floating Audio Player Widget */}
      <MusicPlayerWidget />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 left-5 z-40 p-3 rounded-full bg-slate-900/90 text-white shadow-xl hover:bg-blue-600 border border-slate-700 transition-all active:scale-95"
          title="Kembali ke atas"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Automated WhatsApp Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        defaultGuestName={guestName}
      />

      {/* Digital E-Pass Card Modal */}
      <DigitalPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        rsvpData={rsvpData}
        guestName={guestName}
      />
    </div>
  );
}
