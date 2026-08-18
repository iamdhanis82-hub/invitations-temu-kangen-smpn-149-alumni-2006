import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, X, QrCode, Calendar, MapPin, Download, CheckCircle2, School, Check } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { RSVPData } from '../types';
import smp149Logo from '../assets/images/smp_149_logo_transparent.png';
import { downloadEPassAsImage } from '../utils/downloadPass';

interface DigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvpData: RSVPData | null;
  guestName: string;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  isOpen,
  onClose,
  rsvpData,
  guestName
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const displayName = rsvpData?.name || guestName || 'Alumni 2006 SMPN 149';
  const displayClass = rsvpData?.className || 'Alumni SMPN 149';
  const displayYear = rsvpData?.graduationYear || '2006';

  const handleDownload = () => {
    downloadEPassAsImage(displayName, displayClass, displayYear);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pass Top Card */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/10 rounded-full blur-xl" />
          
          <div className="flex justify-center mb-2">
            <img
              src={smp149Logo || '/images/smp_149_logo_transparent.png'}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.indexOf('/images/smp_149_logo.jpg') === -1) {
                  target.src = '/images/smp_149_logo.jpg';
                }
              }}
              alt="Logo SMPN 149"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain drop-shadow-md"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-[10px] font-bold uppercase tracking-widest mb-3">
            <span>SMP NEGERI 149 JAKARTA TIMUR</span>
          </div>

          <h3 className="text-xl font-bold font-serif text-white">
            E-PASS TEMU KANGEN
          </h3>
          <p className="text-xs text-sky-200 font-light mt-0.5">
            Reuni Akbar Putih Biru 2026
          </p>

          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-[10px] text-sky-300 font-semibold uppercase tracking-wider">Nama Peserta</p>
            <h4 className="text-lg font-bold text-white truncate">{displayName}</h4>
            <p className="text-xs text-slate-200 font-medium">{displayClass} • Angkatan {displayYear}</p>
          </div>
        </div>

        {/* Ticket Perforation Notch */}
        <div className="relative flex items-center justify-between px-3 bg-white py-1">
          <div className="w-6 h-6 rounded-full bg-slate-800 -ml-6" />
          <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-2" />
          <div className="w-6 h-6 rounded-full bg-slate-800 -mr-6" />
        </div>

        {/* Pass Details Bottom */}
        <div className="p-6 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">WAKTU</span>
              <span className="font-bold text-slate-800">{EVENT_DETAILS.date}</span>
              <span className="text-slate-500 block text-[11px]">{EVENT_DETAILS.time}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">LOKASI</span>
              <span className="font-bold text-slate-800 truncate block">{EVENT_DETAILS.venue}</span>
              <span className="text-slate-500 block text-[11px] truncate">Condet, Cililitan, Jaktim</span>
            </div>
          </div>

          {/* QR Code Simulation for Checkin */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-xs border border-blue-200 flex items-center justify-center mb-2">
              <QrCode className="w-20 h-20 text-blue-900" />
            </div>
            <p className="text-[11px] font-bold text-blue-900">
              KODE CHECK-IN: REUNI149-{displayName.slice(0, 3).toUpperCase()}-2026
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tunjukkan e-pass ini pada meja registrasi di Griya Oetami
            </p>
          </div>

          <button
            id="btn-download-epass-modal"
            type="button"
            onClick={handleDownload}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>E-Pass Berhasil Diunduh ke Perangkat!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download E-Pass</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
