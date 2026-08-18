import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, X, MessageSquare, Calendar, Send, Copy, Check, ExternalLink, Sparkles, Smartphone } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { createReminderWhatsAppUrl, createGoogleCalendarUrl, downloadIcsCalendarFile } from '../utils/whatsapp';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGuestName?: string;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  defaultGuestName
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(defaultGuestName || '');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const url = createReminderWhatsAppUrl(phone, name);
    window.open(url, '_blank');
  };

  const reminderTemplateText = `🔔 *PENGINGAT REUNI SMPN 149 JAKARTA TIMUR* 🎓✨
Halo ${name || 'Sahabat Alumni 149'},
Acara Reuni Temu Kangen tinggal menghitung hari:
📅 Tanggal: ${EVENT_DETAILS.date}
⏰ Waktu: ${EVENT_DETAILS.time}
📍 Lokasi: ${EVENT_DETAILS.venue}
${EVENT_DETAILS.address}
🗺️ Maps: ${EVENT_DETAILS.googleMapsUrl}
👔 Dress Code: ${EVENT_DETAILS.dressCode}
Sampai jumpa ya! 💙`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(reminderTemplateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <BellRing className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-sky-200 text-[10px] font-bold uppercase tracking-wider">
                SISTEM PENGINGAT OTOMATIS
              </span>
              <h3 className="text-xl font-bold font-serif">Notifikasi WhatsApp</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Dapatkan pesan pengingat resmi ke WhatsApp Anda lengkap dengan tautan Google Maps, jam acara, dan dresscode agar tidak terlewat.
          </p>

          {/* Form Pengiriman Pengingat */}
          <form onSubmit={handleSendReminder} className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nama Penerima
              </label>
              <input
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nomor WhatsApp Anda <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Buka Pengingat Otomatis di WhatsApp</span>
            </button>
          </form>

          {/* Kalender Options */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Alternatif Pengingat Kalender
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={downloadIcsCalendarFile}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Apple / iCal (.ics)</span>
              </button>
            </div>
          </div>

          {/* Broadcast Template */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Template Pesan Pengingat</span>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                {copiedTemplate ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTemplate ? 'Tersalin' : 'Salin Pesan'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-700 font-sans whitespace-pre-wrap border border-slate-200 leading-relaxed">
              {reminderTemplateText}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
