import { EVENT_DETAILS, COMMITTEE_LIST } from '../data/eventData';
import { RSVPData } from '../types';

/**
 * Creates WhatsApp Click-to-Chat URL with preformatted message
 */
export function createRsvpWhatsAppUrl(rsvp: RSVPData): string {
  const panitiaPhone = COMMITTEE_LIST[4]?.whatsapp || '6285133991006'; // Humas / Panitia WhatsApp
  
  const statusLabel = rsvp.status === 'hadir' 
    ? '✅ *PASTI HADIR*' 
    : rsvp.status === 'ragu' 
    ? '⏳ *RAGU-RAGU / MENYESUAIKAN*' 
    : '❌ *BELUM BISA HADIR*';

  const message = `Halo Panitia Reuni dan Temu Kangen Alumni 2006 SMP Negeri 149 Jakarta Timur! 🎓✨

Saya mau konfirmasi kehadiran untuk acara *Reuni dan Temu Kangen*:
━━━━━━━━━━━━━━━━━━━━
👤 *Nama:* ${rsvp.name}
📚 *Angkatan / Kelas:* ${rsvp.graduationYear || '2006'} (${rsvp.className || '-'})
📱 *No. WhatsApp:* ${rsvp.phone}
📌 *Status Kehadiran:* ${statusLabel}
👥 *Jumlah Kehadiran:* ${rsvp.attendeesCount} Orang
💬 *Pesan/Catatan:* ${rsvp.notes || '-'}
━━━━━━━━━━━━━━━━━━━━
📅 *Hari/Tgl:* ${EVENT_DETAILS.date}
⏰ *Waktu:* ${EVENT_DETAILS.time}
📍 *Lokasi:* ${EVENT_DETAILS.venue}
${EVENT_DETAILS.address}

Mohon dicatat ya Panitia. Terima kasih banyak!`;

  return `https://wa.me/${panitiaPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates automated WhatsApp Reminder template that can be sent to alumni phone
 */
export function createReminderWhatsAppUrl(recipientPhone: string, guestName: string): string {
  // Normalize phone number (e.g. 0812 -> 62812)
  let cleanPhone = recipientPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const message = `🔔 *PENGINGAT RESMI REUNI DAN TEMU KANGEN ALUMNI 2006 SMP NEGERI 149 JAKARTA TIMUR* 🎓✨

Halo Sahabat *${guestName || 'Alumni 2006 SMPN 149'}*,
Ini adalah pesan notifikasi pengingat resmi untuk acara Reuni dan Temu Kangen kita:

━━━━━━━━━━━━━━━━━━━━
📅 *HARI & TANGGAL:*
${EVENT_DETAILS.date}

⏰ *WAKTU:*
Pukul ${EVENT_DETAILS.time}

📍 *LOKASI ACARA:*
*${EVENT_DETAILS.venue}*
${EVENT_DETAILS.address}

🗺️ *PANDUAN GOOGLE MAPS:*
${EVENT_DETAILS.googleMapsUrl}

👔 *DRESS CODE:*
${EVENT_DETAILS.dressCode}
━━━━━━━━━━━━━━━━━━━━

💳 *INFO REKENING REGISTRASI:*
• Bank: ${EVENT_DETAILS.paymentInfo?.bankName || 'BCA'}
• No. Rekening: *${EVENT_DETAILS.paymentInfo?.accountNumber || '7330410081'}*
• Atas Nama: *${EVENT_DETAILS.paymentInfo?.accountHolder || 'Nina Purwati Ningsih'}*
━━━━━━━━━━━━━━━━━━━━

✨ *SUSUNAN KEGIATAN:*
• Registrasi & Sambutan Ketua Panitia
• Santap Siang & Coffee Break di Griya Oetami
• Nostalgia Time (Ngobrol Santai Sesama Alumni)
• Sesi Foto Alumni 2006
• Ramah Tamah & Penutupan

📞 *Kontak Panitia Reuni:*
• Irwanto (Ketua Panitia): 0857 1437 0545
• Lutfi Purboyo (Wakil Ketua): 0856 9782 4092
• Fersi Kurnia Fauziah (Sekretaris): 0878 8816 8136
• Nina Purwati Ningsih (Bendahara): 0857 7651 1918
• Dhani Saputra (Humas): 0851 3399 1006

Sampai jumpa kembali, sahabat putih biru angkatan 2006! Mari kita rajut kembali cerita indah masa sekolah. 💙`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates share link for WhatsApp class groups
 */
export function createShareInvitationWhatsAppUrl(): string {
  const message = `🎓 *UNDANGAN RESMI ALUMNI 2006 SMP NEGERI 149 JAKARTA TIMUR* 🎓

Halo teman-teman alumni 2006 SMP Negeri 149 Jakarta Timur! Yuk hadir dan ramaikan acara Reuni dan Temu Kangen kita:

📅 *Tanggal:* ${EVENT_DETAILS.date}
⏰ *Pukul:* ${EVENT_DETAILS.time}
📍 *Tempat:* ${EVENT_DETAILS.venue} (${EVENT_DETAILS.address})
👔 *Dress Code:* ${EVENT_DETAILS.dressCode}

Silakan buka undangan digital dan konfirmasi kehadiran kamu di link berikut:
👉 ${window.location.href}

Yuk share ke grup angkatan 2006 dan kelas lainnya! Sampai ketemu di hari H yaa! 💙✨`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Creates Google Calendar Add-Event URL
 */
export function createGoogleCalendarUrl(): string {
  const title = encodeURIComponent("Temu Kangen Reuni SMPN 149 Jakarta Timur");
  const details = encodeURIComponent(
    `Reuni Akbar Temu Kangen SMP Negeri 149 Jakarta Timur di Griya Oetami x Koffie Oetami Condet.\nDresscode: ${EVENT_DETAILS.dressCode}\nInfo Panitia: 0851-3399-1006`
  );
  const location = encodeURIComponent(`${EVENT_DETAILS.venue}, ${EVENT_DETAILS.address}`);
  // Date format: YYYYMMDDTHHMMSSZ (01 Nov 2026 14:00 WIB = 07:00 UTC)
  const start = "20261101T070000Z";
  const end = "20261101T130000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Triggers .ics calendar file download for iOS / Android / Outlook
 */
export function downloadIcsCalendarFile() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SMPN 149 Jakarta Timur//Reuni 2026//ID
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:reuni-smpn149-2026@alumni149.id
DTSTAMP:20260101T000000Z
DTSTART:20261101T070000Z
DTEND:20261101T130000Z
SUMMARY:Temu Kangen Reuni SMPN 149 Jakarta Timur
DESCRIPTION:Temu Kangen & Reuni Akbar SMP Negeri 149 Jakarta Timur di Griya Oetami x Koffie Oetami Condet. Dresscode: Putih & Nuansa Biru.
LOCATION:Griya Oetami x Koffie Oetami, Jl. Raya Condet No.7, Cililitan, Kramat Jati, Jakarta Timur
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Pengingat Reuni SMPN 149 Besok Pukul 14.00 WIB!
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Pengingat_Reuni_SMPN149.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
