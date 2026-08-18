import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, BellRing, Download, ExternalLink, Sparkles } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { createGoogleCalendarUrl, downloadIcsCalendarFile } from '../utils/whatsapp';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<{ onOpenReminderModal: () => void }> = ({ onOpenReminderModal }) => {
  const calculateTimeLeft = (): TimeLeft => {
    // 25 Oktober 2026 11:00:00 GMT+7 (WIB)
    const targetDate = new Date(EVENT_DETAILS.targetIsoDate).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'HARI', value: timeLeft.days },
    { label: 'JAM', value: timeLeft.hours },
    { label: 'MENIT', value: timeLeft.minutes },
    { label: 'DETIK', value: timeLeft.seconds }
  ];

  return (
    <section id="countdown-section" className="py-12 px-4 bg-gradient-to-b from-blue-900 to-blue-950 text-white relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-400/30 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-4">
          <Calendar className="w-3.5 h-3.5 text-sky-300" />
          <span>Menuju Hari Bahagia & Temu Kangen</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-2">
          Waktu Mundur Menuju Hari-H
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 font-light">
          Tandai kalender Anda! Jangan sampai terlewatkan momen langka berkumpul kembali bersama sahabat tercinta.
        </p>

        {/* Countdown Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
          {timeUnits.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-sky-400/50 transition-colors"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-blue-200 font-display">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-sky-300 uppercase mt-1">
                {unit.label}
              </div>
              {/* Card top subtle line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Quick Calendar & Reminder Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            id="btn-google-calendar"
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-colors"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Tambah ke Google Calendar</span>
            <ExternalLink className="w-3 h-3 text-blue-200" />
          </a>

          <button
            id="btn-download-ics"
            onClick={downloadIcsCalendarFile}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download Kalender (.ics)</span>
          </button>

          <button
            id="btn-whatsapp-reminder-trigger"
            onClick={onOpenReminderModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-colors"
          >
            <BellRing className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>Set Pengingat WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
