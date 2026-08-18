import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Users, CreditCard, Copy, Check, ShieldCheck, Award, UserCheck, FileText, Wallet, Megaphone, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { COMMITTEE_LIST, EVENT_DETAILS } from '../data/eventData';

interface MemberAvatarConfig {
  cartoonUrl: string;
  bgColor: string;
  borderRing: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

const AVATAR_CONFIGS: Record<string, MemberAvatarConfig> = {
  'Irwanto': {
    cartoonUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Irwanto149&backgroundColor=dbeafe&skinColor=ecad80,f2d3b1',
    bgColor: 'bg-blue-50',
    borderRing: 'ring-amber-400/80 shadow-amber-500/20',
    badgeBg: 'bg-amber-100 border-amber-200 text-amber-900',
    badgeText: 'Ketua Panitia',
    icon: <Award className="w-3.5 h-3.5 text-amber-600" />
  },
  'Lutfi Purboyo': {
    cartoonUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LutfiPurboyo149&backgroundColor=e0e7ff&skinColor=ecad80,f2d3b1',
    bgColor: 'bg-indigo-50',
    borderRing: 'ring-sky-400/80 shadow-sky-500/20',
    badgeBg: 'bg-sky-100 border-sky-200 text-sky-900',
    badgeText: 'Wakil Ketua',
    icon: <UserCheck className="w-3.5 h-3.5 text-sky-600" />
  },
  'Fersi Kurnia Fauziah': {
    cartoonUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FersiKurnia&hair=long02,long04&backgroundColor=fce7f3&skinColor=ecad80,f2d3b1',
    bgColor: 'bg-pink-50',
    borderRing: 'ring-purple-400/80 shadow-purple-500/20',
    badgeBg: 'bg-purple-100 border-purple-200 text-purple-900',
    badgeText: 'Sekretaris',
    icon: <FileText className="w-3.5 h-3.5 text-purple-600" />
  },
  'Nina Purwati Ningsih': {
    cartoonUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NinaPurwatiBendahara&hair=long01,long05&backgroundColor=ecfdf5&skinColor=f2d3b1,ecad80',
    bgColor: 'bg-emerald-50',
    borderRing: 'ring-emerald-400/80 shadow-emerald-500/20',
    badgeBg: 'bg-emerald-100 border-emerald-200 text-emerald-900',
    badgeText: 'Bendahara',
    icon: <Wallet className="w-3.5 h-3.5 text-emerald-600" />
  },
  'Dhani Saputra': {
    cartoonUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DhaniSaputra149&backgroundColor=e0f2fe&skinColor=ecad80,f2d3b1',
    bgColor: 'bg-cyan-50',
    borderRing: 'ring-cyan-400/80 shadow-cyan-500/20',
    badgeBg: 'bg-cyan-100 border-cyan-200 text-cyan-900',
    badgeText: 'Humas',
    icon: <Megaphone className="w-3.5 h-3.5 text-cyan-600" />
  }
};

export const CommitteeContactSection: React.FC = () => {
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyAccount = () => {
    if (EVENT_DETAILS.paymentInfo?.accountNumber) {
      navigator.clipboard.writeText(EVENT_DETAILS.paymentInfo.accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2500);
    }
  };

  const ninaContact = COMMITTEE_LIST.find(m => m.name.includes('Nina')) || COMMITTEE_LIST[3];

  return (
    <section id="kontak-panitia" className="py-16 px-4 bg-white text-slate-800">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Narahubung & Panitia Pelaksana</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Kontak Panitia Reuni
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Ada pertanyaan seputar lokasi, konfirmasi rombongan, atau agenda reuni dan temu kangen? Jangan ragu menghubungi panitia kami.
          </p>
        </div>

        {/* Committee Grid (5 Members with Cartoon Profile Avatars) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {COMMITTEE_LIST.map((member, idx) => {
            const avatar = AVATAR_CONFIGS[member.name] || {
              cartoonUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=dbeafe`,
              bgColor: 'bg-blue-50',
              borderRing: 'ring-blue-400',
              badgeBg: 'bg-blue-100 border-blue-200 text-blue-900',
              badgeText: member.role,
              icon: <Users className="w-3.5 h-3.5 text-blue-600" />
            };

            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between text-center group"
              >
                <div>
                  {/* Cartoon Profile Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className={`w-full h-full rounded-2xl ${avatar.bgColor} p-1 shadow-md border-2 border-white ring-4 ${avatar.borderRing} transition-transform group-hover:scale-105 duration-300 overflow-hidden flex items-center justify-center`}>
                      <img
                        src={avatar.cartoonUrl}
                        alt={`Avatar Kartun ${member.name}`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Role Icon Micro Badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      {avatar.icon}
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-tight mb-2 ${avatar.badgeBg}`}>
                    <span>{member.role}</span>
                  </div>

                  {/* Member Name */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-3">
                    {member.name}
                  </h3>
                </div>

                {/* Direct WhatsApp Contact Button */}
                <div className="pt-3 border-t border-slate-200/80">
                  <a
                    href={`https://wa.me/${member.whatsapp}?text=${encodeURIComponent(`Halo ${member.role} (${member.name}), saya alumni 2006 SMPN 149 ingin bertanya perihal reuni dan temu kangen.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Informasi Pembayaran Registrasi Card */}
        {EVENT_DETAILS.paymentInfo && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                <span>Informasi Rekening Resmi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Pembayaran Registrasi Reuni
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Untuk pembayaran biaya registrasi/kehadiran reuni dan temu kangen alumni 2006 SMPN 149 Jakarta Timur, silakan melakukan transfer ke rekening resmi bendahara panitia berikut:
              </p>

              {/* Deadline Warning Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                <span><strong>Batas Akhir:</strong> Penerimaan terakhir registrasi paling telat tanggal <span className="underline decoration-amber-400 font-bold text-white">01 Oktober 2026</span></span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-300 pt-1">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Rekening resmi terverifikasi panitia atas nama <strong>{EVENT_DETAILS.paymentInfo.accountHolder}</strong></span>
              </div>
            </div>

            {/* Account Transfer Box */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center flex-shrink-0 w-full md:w-[300px]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-extrabold text-xs tracking-wider">
                  {EVENT_DETAILS.paymentInfo.bankName}
                </span>
                <span className="text-xs text-sky-300 font-bold uppercase tracking-wider">
                  Bank Central Asia
                </span>
              </div>
              
              <div className="text-2xl font-mono font-extrabold text-white tracking-widest my-2 select-all">
                {EVENT_DETAILS.paymentInfo.accountNumber}
              </div>
              
              <p className="text-xs text-slate-300 mb-3 font-medium">
                a.n. <strong className="text-white">{EVENT_DETAILS.paymentInfo.accountHolder}</strong>
              </p>

              <div className="space-y-2">
                <button
                  id="btn-copy-rekening-bca"
                  onClick={handleCopyAccount}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                >
                  {copiedBank ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBank ? 'No. Rekening Berhasil Disalin!' : 'Salin Nomor Rekening'}</span>
                </button>

                <a
                  id="btn-konfirmasi-wa-bendahara"
                  href={`https://wa.me/${ninaContact.whatsapp}?text=${encodeURIComponent(`Halo Bu Nina Purwati Ningsih (Bendahara Reuni Alumni 2006 SMPN 149), saya ingin konfirmasi bukti transfer pembayaran registrasi reuni dan temu kangen.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Konfirmasi Bukti Transfer via WA</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
