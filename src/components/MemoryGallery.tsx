import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, BookOpen, Coffee, Bell, Music, MessageSquarePlus, Check, Award, Send } from 'lucide-react';

interface SchoolMemory {
  id: number;
  title: string;
  category: string;
  story: string;
  iconName: 'Bell' | 'Coffee' | 'BookOpen' | 'Music';
  author?: string;
  likes: number;
}

const INITIAL_MEMORIES: SchoolMemory[] = [];

const memoryIcons = {
  Bell: <Bell className="w-5 h-5 text-amber-500" />,
  Coffee: <Coffee className="w-5 h-5 text-orange-500" />,
  BookOpen: <BookOpen className="w-5 h-5 text-blue-500" />,
  Music: <Music className="w-5 h-5 text-indigo-500" />
};

export const MemoryGallery: React.FC = () => {
  const [memories, setMemories] = useState<SchoolMemory[]>(() => {
    const saved = localStorage.getItem('smpn149_school_memories_v2');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('smpn149_liked_memories');
    return saved ? JSON.parse(saved) : [];
  });

  const handleLike = (id: number) => {
    let updatedLikes: number[];
    let updatedMemories: SchoolMemory[];
    if (likedIds.includes(id)) {
      updatedLikes = likedIds.filter(item => item !== id);
      updatedMemories = memories.map(m => m.id === id ? { ...m, likes: m.likes - 1 } : m);
    } else {
      updatedLikes = [...likedIds, id];
      updatedMemories = memories.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    }
    setLikedIds(updatedLikes);
    setMemories(updatedMemories);
    localStorage.setItem('smpn149_liked_memories', JSON.stringify(updatedLikes));
    localStorage.setItem('smpn149_school_memories_v2', JSON.stringify(updatedMemories));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) return;

    const newEntry: SchoolMemory = {
      id: Date.now(),
      title: newTitle.trim(),
      category: "Kenangan Sahabat",
      story: newStory.trim(),
      iconName: "BookOpen",
      author: newAuthor.trim() || "Alumni 2006",
      likes: 1
    };

    const updated = [newEntry, ...memories];
    setMemories(updated);
    localStorage.setItem('smpn149_school_memories_v2', JSON.stringify(updated));
    const newLiked = [...likedIds, newEntry.id];
    setLikedIds(newLiked);
    localStorage.setItem('smpn149_liked_memories', JSON.stringify(newLiked));
    setNewTitle('');
    setNewStory('');
    setNewAuthor('');
    setIsAddingMemory(false);
  };

  return (
    <section id="galeri-kenangan" className="py-16 px-4 bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Nostalgia Putih Biru</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Memori Memori Saat Sekolah
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Mengingat kembali tawa, kejahilan, cita-cita, dan kisah persahabatan manis di bangku SMP Negeri 149 Jakarta Timur.
          </p>
        </div>

        {/* Memory Cards Grid or Empty State */}
        {memories.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Belum Ada Catatan Memori Sekolah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Jadilah alumni pertama yang menceritakan kembali kenangan seru zaman putih-biru di SMPN 149!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {memories.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      {memoryIcons[item.iconName] || <BookOpen className="w-5 h-5 text-blue-600" />}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-[10px] font-bold tracking-tight">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    "{item.story}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/80 text-xs">
                  <span className="text-slate-400 font-medium">
                    Oleh: <strong className="text-slate-600">{item.author || 'Alumni 2006'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                      likedIds.includes(item.id)
                        ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{item.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tulis Kenangan Sekolah CTA */}
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 text-center sm:text-left">
          {!isAddingMemory ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Punya Cerita Kenangan Indah di SMPN 149?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Tuliskan sekelumit cerita masa sekolah Anda untuk dikenang bersama di reuni 2006.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingMemory(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-colors flex-shrink-0"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Bagikan Cerita Kenangan</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddMemory} className="space-y-3.5 text-left">
              <h4 className="text-base font-bold text-slate-900">
                Tulis Cerita / Memori Saat Sekolah
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Judul Kenangan (misal: Main Bola Hujan-Hujanan)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Nama / Panggilan Anda (misal: Dani 9-2)"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Ceritakan momen nostalgia Anda..."
                value={newStory}
                onChange={(e) => setNewStory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan Cerita</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingMemory(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
