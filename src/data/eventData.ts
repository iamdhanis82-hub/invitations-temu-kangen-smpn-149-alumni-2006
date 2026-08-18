import { CommitteeMember, ScheduleItem, GuestbookMessage } from '../types';

export const EVENT_DETAILS = {
  title: "Reuni dan Temu Kangen",
  schoolName: "SMP Negeri 149 Jakarta Timur",
  tagline: "Merajut Silaturahmi, Membangkitkan Kenangan Putih Biru",
  theme: "Kisah Klasik Masa Sekolah, Sahabat Selamanya",
  date: "Minggu, 01 November 2026",
  time: "14.00 WIB - Selesai",
  targetIsoDate: "2026-11-01T14:00:00+07:00",
  venue: "Griya Oetami x Koffie Oetami",
  address: "Jl. Raya Condet No.7, RT.3/RW.16, Cililitan, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13640",
  dressCode: "Putih & Nuansa Biru (Casual Smart / Nostalgia Style)",
  googleMapsUrl: "https://maps.google.com/?q=Griya+Oetami+x+Koffie+Oetami+Jl+Raya+Condet+No+7+Cililitan+Jakarta+Timur",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Griya+Oetami+x+Koffie+Oetami+Jl.+Raya+Condet+No.7+Cililitan+Jakarta+Timur&t=&z=16&ie=UTF8&iwloc=&output=embed",
  wazeUrl: "https://waze.com/ul?q=Griya%20Oetami%20x%20Koffie%20Oetami%20Condet",
  paymentInfo: {
    bankName: "BCA",
    accountNumber: "7330410081",
    accountHolder: "Nina Purwati Ningsih",
    deadline: "01 Oktober 2026",
    deadlineNote: "Penerimaan registrasi terakhir paling telat di tanggal 01 Oktober 2026"
  },
  music: {
    title: "Memori Baik",
    artist: "Sheila On 7",
    audioSrc: "/audio/sheila-on-7-memori-baik.mp3",
    tag: "Lagu Tema Reuni"
  }
};

export const COMMITTEE_LIST: CommitteeMember[] = [
  {
    role: "Ketua Panitia",
    name: "Irwanto",
    phone: "085714370545",
    whatsapp: "6285714370545",
    avatar: "",
    description: "Koordinator Utama Reuni & Alumni"
  },
  {
    role: "Wakil Ketua",
    name: "Lutfi Purboyo",
    phone: "085697824092",
    whatsapp: "6285697824092",
    avatar: "",
    description: "Pendamping Ketua & Koordinasi Lapangan"
  },
  {
    role: "Sekretaris",
    name: "Fersi Kurnia Fauziah",
    phone: "087888168136",
    whatsapp: "6287888168136",
    avatar: "",
    description: "Administrasi, Pendataan & Notulensi"
  },
  {
    role: "Bendahara",
    name: "Nina Purwati Ningsih",
    phone: "0857-7651-1918",
    whatsapp: "6285776511918",
    avatar: "",
    description: "Konfirmasi Pembayaran Registrasi (BCA)"
  },
  {
    role: "Humas",
    name: "Dhani Saputra",
    phone: "085133991006",
    whatsapp: "6285133991006",
    avatar: "",
    description: "Hubungan Alumni, Informasi & Media"
  }
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: "14.00 - 14.30 WIB",
    title: "Registrasi & Temu Sapa Hangat",
    description: "Penerimaan tamu alumni, registrasi presensi, photo booth selamat datang & welcome drink.",
    iconName: "UserCheck"
  },
  {
    time: "14.30 - 15.00 WIB",
    title: "Sambutan Ketua Panitia",
    description: "Sambutan hangat dari Ketua Panitia Reuni 2006 (Irwanto) dan pembukaan rangkaian acara temu kangen.",
    iconName: "Sparkles"
  },
  {
    time: "15.00 - 16.15 WIB",
    title: "Santap Sore & Coffee Break di Griya Oetami",
    description: "Makan bersama dan coffee break sajian istimewa Griya Oetami x Koffie Oetami diiringi alunan live acoustic nostalgia.",
    iconName: "Utensils"
  },
  {
    time: "16.15 - 17.15 WIB",
    title: "Nostalgia Time",
    description: "Sesi ngobrol santai sesama alumni, mengenang masa-masa indah putih biru di SMP Negeri 149 Jakarta Timur.",
    iconName: "Heart"
  },
  {
    time: "17.15 - 18.00 WIB",
    title: "Sesi Foto Alumni 2006",
    description: "Sesi foto bersama seluruh alumni 2006 dan foto per rombel/kelas untuk mengabadikan momen kebersamaan reuni.",
    iconName: "Camera"
  },
  {
    time: "18.00 WIB - Selesai",
    title: "Ramah Tamah & Penutupan",
    description: "Tukar kado/kontak, saling berpelukan melepas rindu, doa bersama sesama sahabat alumni dan penutup acara.",
    iconName: "Sparkles"
  }
];

export const INITIAL_GUESTBOOK: GuestbookMessage[] = [];

export const NOSTALGIA_MEMORIES = [
  {
    id: 1,
    title: "Upacara Bendera Senin & Baris Berbaris",
    desc: "Momen berdiri tegak di lapangan SMPN 149, nyanyi lagu kebangsaan & deg-degan kalau atribut topi/dasi ketinggalan!",
    tag: "Kenangan Lapangan",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Kantin Kejujuran & Jajanan Legendaris",
    desc: "Es lilin, cilok bumbu kacang, gorengan hangat, dan mi instan favorit waktu jam istirahat pertama.",
    tag: "Kantin 149",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Kerja Kelompok & Perpustakaan",
    desc: "Belajar bareng di perpus yang adem, ngerjain tugas IPA/Matematika sambil curhat dan bercanda.",
    tag: "Ruang Kelas",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Kegiatan Ekstrakurikuler & Pramuka",
    desc: "Latihan paskibra, basket, PMR, pramuka sabtu sore, dan pensi sekolah yang selalu ditunggu-tunggu.",
    tag: "Ekskul & Pensi",
    image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80"
  }
];
