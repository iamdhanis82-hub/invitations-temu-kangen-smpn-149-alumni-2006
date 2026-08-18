import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserCheck, Send, CheckCircle2, MessageSquare, Users, Bell, Sparkles, Filter, Search, Phone, Check, Award, CreditCard, Copy, Radio, Loader2, Clock, Download, QrCode } from 'lucide-react';
import { RSVPData } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import { createRsvpWhatsAppUrl, createReminderWhatsAppUrl } from '../utils/whatsapp';
import { downloadEPassAsImage } from '../utils/downloadPass';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const INITIAL_RSVPS: RSVPData[] = [];

interface RsvpSectionProps {
  onRsvpSuccess: (data: RSVPData) => void;
  guestName: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onRsvpSuccess, guestName }) => {
  const [rsvpList, setRsvpList] = useState<RSVPData[]>(() => {
    const saved = localStorage.getItem('smpn149_rsvp_list_v2');
    return saved ? JSON.parse(saved) : INITIAL_RSVPS;
  });

  const [formData, setFormData] = useState({
    name: guestName || '',
    graduationYear: '2006',
    className: '3-1',
    phone: '',
    status: 'hadir' as 'hadir' | 'tidak_hadir' | 'ragu',
    attendeesCount: 1,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);
  const [submittedRsvp, setSubmittedRsvp] = useState<RSVPData | null>(null);
  const [downloadedPass, setDownloadedPass] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'hadir' | 'ragu' | 'tidak_hadir'>('ALL');

  const handleDownloadEPass = () => {
    if (submittedRsvp) {
      downloadEPassAsImage(submittedRsvp.name, submittedRsvp.className, submittedRsvp.graduationYear);
      setDownloadedPass(true);
      setTimeout(() => setDownloadedPass(false), 3500);
    }
  };

  // Real-time Firestore Listener
  useEffect(() => {
    try {
      const rsvpCol = collection(db, 'rsvps');
      const unsubscribe = onSnapshot(
        rsvpCol,
        (snapshot) => {
          setIsRealtimeActive(true);
          const docs = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const rawCreatedAt = data.createdAt ? new Date(data.createdAt).getTime() : 0;
            return {
              id: docSnap.id,
              name: data.name || '',
              graduationYear: data.graduationYear || '2006',
              className: data.className || 'Kelas 3-1',
              phone: data.phone || '',
              status: data.status || 'hadir',
              attendeesCount: Number(data.attendeesCount ?? 1),
              notes: data.notes || '',
              rawCreatedAt,
              timestamp: data.createdAt 
                ? new Date(data.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                : 'Terkonfirmasi'
            };
          });

          // Sort newest first
          docs.sort((a, b) => b.rawCreatedAt - a.rawCreatedAt);

          if (docs.length > 0) {
            setRsvpList(docs);
            localStorage.setItem('smpn149_rsvp_list_v2', JSON.stringify(docs));
          }
        },
        (error) => {
          console.warn('Firestore real-time subscription error:', error);
          setIsRealtimeActive(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase initialization note:', err);
      setIsRealtimeActive(false);
    }
  }, []);

  useEffect(() => {
    if (guestName && !formData.name) {
      setFormData(prev => ({ ...prev, name: guestName }));
    }
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const newRsvp: RSVPData = {
      id: 'rsvp-' + Date.now(),
      name: formData.name.trim(),
      graduationYear: formData.graduationYear,
      className: `Kelas ${formData.className}`,
      phone: formData.phone.trim(),
      status: formData.status,
      attendeesCount: formData.status === 'hadir' ? Number(formData.attendeesCount) : 0,
      notes: formData.notes.trim(),
      timestamp: 'Baru saja'
    };

    // Save to Firestore for real-time broadcast to all alumni
    try {
      await addDoc(collection(db, 'rsvps'), {
        name: newRsvp.name,
        graduationYear: newRsvp.graduationYear,
        className: newRsvp.className,
        phone: newRsvp.phone,
        status: newRsvp.status,
        attendeesCount: newRsvp.attendeesCount,
        notes: newRsvp.notes,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Fallback saving locally:', err);
    }

    // Update local state optimistic
    const updatedList = [newRsvp, ...rsvpList.filter(item => item.name !== newRsvp.name)];
    setRsvpList(updatedList);
    localStorage.setItem('smpn149_rsvp_list_v2', JSON.stringify(updatedList));
    setSubmittedRsvp(newRsvp);
    onRsvpSuccess(newRsvp);
    setIsSubmitting(false);

    // Fire Confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#fbbf24', '#ffffff']
      });
    } catch {
      // safe fallback
    }
  };

  const hadirCount = rsvpList.filter(r => r.status === 'hadir').length;
  const raguCount = rsvpList.filter(r => r.status === 'ragu').length;
  const tidakHadirCount = rsvpList.filter(r => r.status === 'tidak_hadir').length;

  const confirmedCount = rsvpList
    .filter(r => r.status === 'hadir')
    .reduce((acc, curr) => acc + (curr.attendeesCount || 1), 0);

  const filteredList = rsvpList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = filterClass === 'ALL' || item.className.includes(filterClass);
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  return (
    <section id="rsvp-kehadiran" className="py-16 px-4 bg-gradient-to-b from-white via-blue-50/40 to-white text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Konfirmasi Kehadiran Alumni Real-Time</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Formulir RSVP Reuni
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Bantu panitia mempersiapkan konsumsi dan reservasi tempat di Griya Oetami dengan mengisi formulir di bawah ini.
          </p>
        </div>

        {/* Live Attendance Counter Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider flex items-center gap-2">
                Total Alumni & Tamu Terdaftar
                {isRealtimeActive && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Sync
                  </span>
                )}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-sky-300 font-display">{confirmedCount}</span> Orang Telah Konfirmasi Hadir
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {hadirCount} Hadir
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {raguCount} Ragu
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {tidakHadirCount} Absen
            </span>
          </div>
        </div>

        {/* Main Form or Success State */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form / Success Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
            {submittedRsvp ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-serif text-slate-900">
                    Terima Kasih, {submittedRsvp.name}!
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Konfirmasi kehadiran Anda telah tersimpan secara langsung (*real-time*) dalam sistem buku tamu alumni SMPN 149.
                  </p>
                </div>

                {/* RSVP Details Summary */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-left text-xs sm:text-sm space-y-2 text-slate-700">
                  <div className="flex justify-between border-b border-blue-200/50 pb-1.5">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-blue-800 uppercase">{submittedRsvp.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200/50 pb-1.5">
                    <span className="text-slate-500">Angkatan & Kelas:</span>
                    <span className="font-semibold text-slate-800">{submittedRsvp.graduationYear} ({submittedRsvp.className})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jumlah Orang:</span>
                    <span className="font-semibold text-slate-800">{submittedRsvp.attendeesCount} Orang</span>
                  </div>
                </div>

                {/* Pembayaran Registrasi Card */}
                {submittedRsvp.status === 'hadir' && EVENT_DETAILS.paymentInfo && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <CreditCard className="w-4 h-4 text-amber-700" />
                        <span>Informasi Rekening Pembayaran Registrasi</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 text-[10px] font-bold">
                        BCA
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Silakan transfer biaya registrasi ke rekening resmi panitia:
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-extrabold text-sm text-slate-900 tracking-wider">
                          BCA {EVENT_DETAILS.paymentInfo.accountNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          a.n. {EVENT_DETAILS.paymentInfo.accountHolder}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (EVENT_DETAILS.paymentInfo?.accountNumber) {
                            navigator.clipboard.writeText(EVENT_DETAILS.paymentInfo.accountNumber);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </button>
                    </div>

                    {/* Deadline info */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px]">
                      <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span><strong>Batas Registrasi:</strong> Penerimaan terakhir registrasi paling telat tanggal <strong>01 Oktober 2026</strong>.</span>
                    </div>
                  </div>
                )}

                {/* E-Pass Direct Download Card */}
                {submittedRsvp.status === 'hadir' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white text-left space-y-3 shadow-lg border border-blue-700/50 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-sky-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">E-Pass Undangan Reuni</h4>
                          <p className="text-[10px] text-sky-200">Tiket Masuk & Check-In Resmi</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                        Siap Diunduh
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      E-Pass Anda sudah siap. Silakan download langsung ke galeri HP / perangkat Anda untuk ditunjukkan saat registrasi di lokasi acara.
                    </p>

                    <button
                      type="button"
                      id="btn-download-epass-rsvp"
                      onClick={handleDownloadEPass}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                        downloadedPass
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-blue-900 hover:bg-sky-50'
                      }`}
                    >
                      {downloadedPass ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>✓ E-Pass Berhasil Diunduh ke Perangkat Anda!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-blue-700" />
                          <span>Download E-Pass</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* WhatsApp Action Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    id="btn-send-whatsapp-panitia"
                    href={createRsvpWhatsAppUrl(submittedRsvp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>Kirim Konfirmasi ke WhatsApp Panitia</span>
                  </a>

                  <a
                    id="btn-send-whatsapp-self-reminder"
                    href={createReminderWhatsAppUrl(submittedRsvp.phone, submittedRsvp.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Bell className="w-4 h-4 text-sky-200" />
                    <span>Kirim Notifikasi Pengingat ke WhatsApp Saya</span>
                  </a>

                  <button
                    onClick={() => setSubmittedRsvp(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline pt-2"
                  >
                    Ubah Data / Isi Konfirmasi Lain
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-slate-900">
                      Formulir Pendaftaran
                    </h3>
                    <p className="text-xs text-slate-500">
                      Lengkapi data diri Anda di bawah ini
                    </p>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Cloud Sync
                  </span>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendra Kusuma / Siti Rahmawati"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 transition-all"
                  />
                </div>

                {/* Angkatan & Kelas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tahun Kelulusan / Angkatan
                    </label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 bg-white transition-all"
                    >
                      <option value="2004">Lulus 2004</option>
                      <option value="2005">Lulus 2005</option>
                      <option value="2006">Lulus 2006 (Angkatan Utama)</option>
                      <option value="2007">Lulus 2007</option>
                      <option value="2008">Lulus 2008</option>
                      <option value="2009">Lulus 2009</option>
                      <option value="2010">Lulus 2010</option>
                      <option value="Lainnya">Angkatan Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Kelas Terakhir di SMP 149
                    </label>
                    <select
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 bg-white transition-all"
                    >
                      <option value="3-1">Kelas 3-1</option>
                      <option value="3-2">Kelas 3-2</option>
                      <option value="3-3">Kelas 3-3</option>
                      <option value="3-4">Kelas 3-4</option>
                    </select>
                  </div>
                </div>

                {/* Nomor WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Digunakan untuk pengiriman notifikasi pengingat H-1 & info resmi reuni.
                  </p>
                </div>

                {/* Status Kehadiran Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Konfirmasi Kehadiran <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'hadir' })}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                        formData.status === 'hadir'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Pasti Hadir</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'ragu' })}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                        formData.status === 'ragu'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Ragu-Ragu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 'tidak_hadir' })}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                        formData.status === 'tidak_hadir'
                          ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>❌ Berhalangan</span>
                    </button>
                  </div>
                </div>

                {formData.status === 'hadir' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-1"
                  >
                    {/* Jumlah Kehadiran */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Jumlah Hadir (Orang)
                      </label>
                      <select
                        value={formData.attendeesCount}
                        onChange={(e) => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 bg-white transition-all"
                      >
                        <option value={1}>1 Orang (Sendiri)</option>
                        <option value={2}>2 Orang (Bersama Pasangan)</option>
                        <option value={3}>3 Orang (Keluarga)</option>
                        <option value={4}>4 Orang</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Pesan / Catatan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pesan / Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tulis pesan untuk panitia atau teman seangkatan..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-900 transition-all resize-none"
                  />
                </div>

                {/* Registration Deadline Alert */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Pemberitahuan Registrasi:</strong> Penerimaan terakhir registrasi paling telat tanggal <strong>01 Oktober 2026</strong>.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-submit-rsvp"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Kirim Konfirmasi Kehadiran</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Daftar Alumni yang Sudah Konfirmasi (Real-Time) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    Daftar Teman yang Hadir
                  </h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Update langsung secara *real-time*
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {rsvpList.length} Terdata
              </span>
            </div>

            {/* Search, Status Tabs, and Class Filter */}
            <div className="space-y-2.5 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama atau kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 bg-slate-50"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-xl text-[11px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => setFilterStatus('ALL')}
                  className={`py-1.5 px-1 rounded-lg transition-all ${
                    filterStatus === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({rsvpList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('hadir')}
                  className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    filterStatus === 'hadir'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-700 hover:bg-emerald-100/50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Hadir ({hadirCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('ragu')}
                  className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    filterStatus === 'ragu'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-amber-700 hover:bg-amber-100/50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Ragu ({raguCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('tidak_hadir')}
                  className={`py-1.5 px-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                    filterStatus === 'tidak_hadir'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Absen ({tidakHadirCount})
                </button>
              </div>

              {/* Class Filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1">Kelas:</span>
                {['ALL', '3-1', '3-2', '3-3', '3-4'].map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setFilterClass(cls)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      filterClass === cls
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls === 'ALL' ? 'Semua' : `Kelas ${cls}`}
                  </button>
                ))}
              </div>
            </div>

            {/* List of RSVPs */}
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 flex-1 flex flex-col">
              {filteredList.length === 0 ? (
                <div className="text-center py-10 px-4 my-auto rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  {rsvpList.length === 0 ? (
                    <>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        Belum Ada Alumni yang Mendaftar
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Jadilah alumni pertama yang mengonfirmasi kehadiran di formulir sebelah kiri!
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        Data Tidak Ditemukan
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tidak ada teman yang cocok dengan pencarian atau filter kelas ini.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                filteredList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {item.className}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Lulus: {item.graduationYear} • {item.attendeesCount > 0 ? `${item.attendeesCount} orang` : 'Berhalangan'}
                      </p>
                      {item.notes && (
                        <p className="text-slate-600 italic text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {item.status === 'hadir' ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Hadir
                        </span>
                      ) : item.status === 'ragu' ? (
                        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Ragu
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                          Absen
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

