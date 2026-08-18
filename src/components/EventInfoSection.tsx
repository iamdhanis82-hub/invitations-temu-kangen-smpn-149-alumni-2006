import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Shirt, Sparkles, ChevronDown, UserCheck, Utensils, Gift, Camera, Heart, CheckCircle2 } from 'lucide-react';
import { EVENT_DETAILS, SCHEDULE_ITEMS } from '../data/eventData';

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-5 h-5 text-blue-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Utensils: <Utensils className="w-5 h-5 text-emerald-600" />,
  Gift: <Gift className="w-5 h-5 text-purple-600" />,
  Camera: <Camera className="w-5 h-5 text-sky-600" />,
  Heart: <Heart className="w-5 h-5 text-rose-500" />
};

export const EventInfoSection: React.FC = () => {
  const [showAllRundown, setShowAllRundown] = useState(false);

  return (
    <section id="detail-acara" className="py-16 px-4 bg-white text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Informasi Lengkap Acara</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Pelaksanaan Temu Kangen
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Mari hadir bersama dalam suasana kebersamaan yang hangat, santai, dan penuh cerita berkesan.
          </p>
        </div>

        {/* 3 Main Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Waktu & Tanggal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-sky-50/50 border border-blue-100 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                Hari & Tanggal
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {EVENT_DETAILS.date}
              </h3>
              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Pukul {EVENT_DETAILS.time}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/60 text-xs text-blue-900 font-medium">
              *Harap hadir 15 menit sebelum acara dimulai untuk registrasi
            </div>
          </motion.div>

          {/* Card 2: Lokasi & Suasana */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 to-indigo-50/50 border border-sky-100 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-500/20">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-1">
                Tempat Pelaksanaan
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {EVENT_DETAILS.venue}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                {EVENT_DETAILS.address}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-200/60 text-xs text-sky-900 font-medium">
              *Suasana kafe & resto estetik yang nyaman, ber-AC, dan area parkir tersedia
            </div>
          </motion.div>

          {/* Card 3: Dress Code & Konsep */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/50 border border-indigo-100 shadow-sm flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                <Shirt className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1">
                Dress Code Acara
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Nuansa Putih & Biru
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Pakaian sopan kasual / semi formal bertema seragam putih-biru SMP untuk foto kebersamaan yang estetik & kompak.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-200/60 text-xs text-indigo-900 font-medium">
              *Akan ada sesi foto booth & penghargaan pakaian terfavorit
            </div>
          </motion.div>
        </div>

        {/* Rundown / Susunan Acara Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Susunan Acara (Rundown)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Rangkaian kegiatan santai & menyenangkan dari awal hingga selesai
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              6 Sesi Utama
            </span>
          </div>

          <div className="space-y-4">
            {(showAllRundown ? SCHEDULE_ITEMS : SCHEDULE_ITEMS.slice(0, 3)).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 flex-shrink-0">
                  {iconMap[item.iconName] || <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold self-start sm:self-auto">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllRundown(!showAllRundown)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>{showAllRundown ? 'Tutup Rincian Acara' : 'Lihat Seluruh Susunan Acara'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllRundown ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
