import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquareHeart, Send, Heart, Sparkles, Filter, Search, Smile, User, ThumbsUp, Loader2 } from 'lucide-react';
import { GuestbookMessage } from '../types';
import { INITIAL_GUESTBOOK } from '../data/eventData';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

const MOODS: { key: GuestbookMessage['mood']; label: string; icon: string }[] = [
  { key: 'nostalgia', label: 'Nostalgia Putih Biru', icon: '🎓' },
  { key: 'excited', label: 'Semangat Reuni', icon: '🔥' },
  { key: 'miss_friends', label: 'Kangen Sahabat', icon: '💙' },
  { key: 'grateful', label: 'Syukur & Doa', icon: '🤲' },
];

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-sky-600',
  'bg-teal-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-purple-600'
];

interface GuestbookSectionProps {
  guestName?: string;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ guestName }) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>(() => {
    const saved = localStorage.getItem('smpn149_guestbook_messages_v2');
    return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
  });

  const [name, setName] = useState(guestName || '');
  const [graduationYear, setGraduationYear] = useState('2006');
  const [className, setClassName] = useState('Kelas 3-1');
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<GuestbookMessage['mood']>('nostalgia');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('smpn149_liked_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Real-time Firestore sync for guestbook
  useEffect(() => {
    try {
      const gbCol = collection(db, 'guestbook');
      const unsubscribe = onSnapshot(
        gbCol,
        (snapshot) => {
          const docs = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const rawCreatedAt = data.createdAt ? new Date(data.createdAt).getTime() : 0;
            return {
              id: docSnap.id,
              name: data.name || 'Alumni',
              graduationYear: data.graduationYear || '2006',
              className: data.className || 'Kelas 3-1',
              message: data.message || '',
              mood: data.mood || 'nostalgia',
              rawCreatedAt,
              timestamp: data.createdAt 
                ? new Date(data.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                : 'Baru saja',
              likes: Number(data.likes || 1),
              avatarColor: data.avatarColor || AVATAR_COLORS[0]
            };
          });

          // Sort newest first
          docs.sort((a, b) => b.rawCreatedAt - a.rawCreatedAt);

          if (docs.length > 0) {
            setMessages(docs);
            localStorage.setItem('smpn149_guestbook_messages_v2', JSON.stringify(docs));
          }
        },
        (error) => {
          console.warn('Firestore guestbook listener note:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Guestbook sync error:', err);
    }
  }, []);

  useEffect(() => {
    if (guestName && !name) {
      setName(guestName);
    }
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSending) return;

    setIsSending(true);
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newMessage: GuestbookMessage = {
      id: 'gb-' + Date.now(),
      name: name.trim(),
      graduationYear,
      className,
      message: message.trim(),
      mood,
      timestamp: 'Baru saja',
      likes: 1,
      avatarColor: randomColor
    };

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: newMessage.name,
        graduationYear: newMessage.graduationYear,
        className: newMessage.className,
        message: newMessage.message,
        mood: newMessage.mood,
        likes: 1,
        avatarColor: randomColor,
        createdAt: new Date().toISOString()
      });
      setMessage('');
    } catch (err) {
      console.warn('Fallback guestbook local save:', err);
      const updated = [newMessage, ...messages];
      setMessages(updated);
      localStorage.setItem('smpn149_guestbook_messages_v2', JSON.stringify(updated));
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleLike = async (id: string) => {
    const isCurrentlyLiked = likedIds.includes(id);
    if (isCurrentlyLiked) {
      // unlike
      const updatedLiked = likedIds.filter(item => item !== id);
      setLikedIds(updatedLiked);
      localStorage.setItem('smpn149_liked_messages', JSON.stringify(updatedLiked));

      const updated = messages.map(m => m.id === id ? { ...m, likes: Math.max(0, m.likes - 1) } : m);
      setMessages(updated);

      if (!id.startsWith('init-') && !id.startsWith('gb-')) {
        try {
          await updateDoc(doc(db, 'guestbook', id), { likes: increment(-1) });
        } catch (e) {
          console.warn('Like update note:', e);
        }
      }
    } else {
      // like
      const updatedLiked = [...likedIds, id];
      setLikedIds(updatedLiked);
      localStorage.setItem('smpn149_liked_messages', JSON.stringify(updatedLiked));

      const updated = messages.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
      setMessages(updated);

      if (!id.startsWith('init-') && !id.startsWith('gb-')) {
        try {
          await updateDoc(doc(db, 'guestbook', id), { likes: increment(1) });
        } catch (e) {
          console.warn('Like update note:', e);
        }
      }
    }
  };

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="buku-tamu" className="py-16 px-4 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5 text-blue-600" />
            <span>Buku Tamu Digital & Pesan Kenangan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Untaian Doa & Cerita Alumni
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Tinggalkan pesan hangat, kenangan masa sekolah, atau sapaan rindu untuk teman-teman dan sahabat tercinta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Write Message Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-7">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Tulis Ucapan Anda</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Pesan Anda akan langsung tampil secara real-time di seluruh layar ponsel alumni
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Anda <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap / Panggilan di SMP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm text-slate-900"
                />
              </div>

              {/* Angkatan & Kelas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Angkatan
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-xs text-slate-900 bg-white"
                  >
                    <option value="2005">2005</option>
                    <option value="2006">2006</option>
                    <option value="2007">2007</option>
                    <option value="2008">2008</option>
                    <option value="2009">2009</option>
                    <option value="2010">2010</option>
                    <option value="Semua">Angkatan Lain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 outline-none text-xs text-slate-900 bg-white"
                  >
                    <option value="Kelas 3-1">Kelas 3-1</option>
                    <option value="Kelas 3-2">Kelas 3-2</option>
                    <option value="Kelas 3-3">Kelas 3-3</option>
                    <option value="Kelas 3-4">Kelas 3-4</option>
                  </select>
                </div>
              </div>

              {/* Mood / Suasana */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Ekspresi Hati
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMood(m.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        mood === m.key
                          ? 'bg-blue-50 text-blue-700 border-blue-500 ring-2 ring-blue-200 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pesan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pesan Kenangan / Harapan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tulis kenangan manis zaman SMP, sapaan buat kawan lama, atau doa untuk kelancaran reuni..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs sm:text-sm text-slate-900 resize-none"
                />
              </div>

              <button
                id="btn-submit-guestbook"
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim ke Dinding Reuni...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan ke Dinding Reuni</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Message Stream Wall */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pesan ucapan atau nama alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none bg-slate-50 focus:bg-white"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium px-2 flex-shrink-0">
                {filteredMessages.length} Ucapan
              </span>
            </div>

            {/* List Messages */}
            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <MessageSquareHeart className="w-6 h-6" />
                  </div>
                  {messages.length === 0 ? (
                    <>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        Belum Ada Cerita atau Ucapan Alumni
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Jadilah yang pertama membagikan kenangan masa sekolah, sapaan hangat, atau doa di dinding reuni ini!
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        Ucapan Tidak Ditemukan
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tidak ada pesan yang cocok dengan kata kunci pencarian Anda.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                filteredMessages.map((msg) => {
                const isLiked = likedIds.includes(msg.id);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-200 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${msg.avatarColor || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0`}>
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold">
                              {msg.className} ({msg.graduationYear})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{msg.timestamp}</p>
                        </div>
                      </div>

                      {/* Mood Badge */}
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1 flex-shrink-0">
                        {msg.mood === 'nostalgia' && '🎓 Nostalgia'}
                        {msg.mood === 'excited' && '🔥 Semangat'}
                        {msg.mood === 'miss_friends' && '💙 Kangen'}
                        {msg.mood === 'grateful' && '🤲 Doa'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                      {msg.message}
                    </p>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[11px] text-slate-400">SMPN 149 Jakarta Timur</span>
                      <button
                        type="button"
                        onClick={() => handleLike(msg.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 font-bold'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        <span>{msg.likes} Suka</span>
                      </button>
                    </div>
                  </motion.div>
                );
              }))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
