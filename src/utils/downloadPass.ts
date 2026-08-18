import { EVENT_DETAILS } from '../data/eventData';

export function downloadEPassAsImage(
  name: string,
  className: string = 'Alumni SMPN 149',
  graduationYear: string = '2006'
): void {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.fillRect(0, 0, width, height);

  // Card Outer Container
  const pad = 40;
  const cardW = width - pad * 2;
  const cardH = height - pad * 2;
  const radius = 32;

  // Card Background with Rounded corners
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, cardW, cardH, radius);
  ctx.clip();

  // Top Section Gradient
  const grad = ctx.createLinearGradient(0, pad, width, 560);
  grad.addColorStop(0, '#0c2340');
  grad.addColorStop(0.5, '#1e3a8a');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(pad, pad, cardW, 520);

  // Decorative circles
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.beginPath();
  ctx.arc(cardW, 100, 180, 0, Math.PI * 2);
  ctx.fill();

  // Badge Top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 200, pad + 35, 400, 44, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#bae6fd'; // sky-200
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎓 SMP NEGERI 149 JAKARTA TIMUR', width / 2, pad + 63);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('E-PASS TEMU KANGEN', width / 2, pad + 140);

  ctx.fillStyle = '#7dd3fc'; // sky-300
  ctx.font = '22px "Playfair Display", Georgia, serif';
  ctx.fillText('Reuni Akbar Putih Biru 2026', width / 2, pad + 180);

  // Guest Box
  const guestBoxY = pad + 220;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.roundRect(pad + 40, guestBoxY, cardW - 80, 160, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.stroke();

  ctx.fillStyle = '#93c5fd'; // blue-300
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('NAMA PESERTA TERDAFTAR', width / 2, guestBoxY + 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  // Truncate if too long
  let safeName = name || 'Alumni 2006 SMPN 149';
  if (safeName.length > 24) {
    safeName = safeName.slice(0, 22) + '...';
  }
  ctx.fillText(safeName, width / 2, guestBoxY + 86);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${className} • Angkatan ${graduationYear}`, width / 2, guestBoxY + 124);

  // Perforated line
  const dividerY = pad + 520;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, dividerY, cardW, height - dividerY - pad);

  // Notch circles
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(pad, dividerY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - pad, dividerY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Dashed line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(pad + 30, dividerY);
  ctx.lineTo(width - pad - 30, dividerY);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Bottom white card content
  // Event Details 2 boxes
  const box1Y = dividerY + 40;
  const colW = (cardW - 100) / 2;

  // Box 1: Time
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(pad + 40, box1Y, colW, 110, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('WAKTU ACARA', pad + 56, box1Y + 30);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText(EVENT_DETAILS.date, pad + 56, box1Y + 60);
  ctx.fillStyle = '#475569';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText(EVENT_DETAILS.time, pad + 56, box1Y + 86);

  // Box 2: Location
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(pad + 40 + colW + 20, box1Y, colW, 110, 16);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillText('LOKASI REUNI', pad + 56 + colW + 20, box1Y + 30);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillText(EVENT_DETAILS.venue, pad + 56 + colW + 20, box1Y + 60);
  ctx.fillStyle = '#475569';
  ctx.font = '15px -apple-system, sans-serif';
  ctx.fillText('Condet, Cililitan, Jaktim', pad + 56 + colW + 20, box1Y + 86);

  // QR Code Area
  const qrBoxY = box1Y + 135;
  ctx.fillStyle = '#eff6ff';
  ctx.beginPath();
  ctx.roundRect(pad + 40, qrBoxY, cardW - 80, 240, 24);
  ctx.fill();
  ctx.strokeStyle = '#bfdbfe';
  ctx.stroke();

  // Draw simulated crisp QR pattern in center
  const qrCenterY = qrBoxY + 30;
  const qrSize = 100;
  const qrX = width / 2 - qrSize / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX, qrCenterY, qrSize, qrSize);
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 3;
  ctx.strokeRect(qrX, qrCenterY, qrSize, qrSize);

  // QR Corner squares
  ctx.fillStyle = '#1e3a8a';
  // Top left
  ctx.fillRect(qrX + 8, qrCenterY + 8, 26, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX + 13, qrCenterY + 13, 16, 16);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(qrX + 16, qrCenterY + 16, 10, 10);

  // Top right
  ctx.fillRect(qrX + qrSize - 34, qrCenterY + 8, 26, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX + qrSize - 29, qrCenterY + 13, 16, 16);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(qrX + qrSize - 26, qrCenterY + 16, 10, 10);

  // Bottom left
  ctx.fillRect(qrX + 8, qrCenterY + qrSize - 34, 26, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX + 13, qrCenterY + qrSize - 29, 16, 16);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(qrX + 16, qrCenterY + qrSize - 26, 10, 10);

  // Random QR matrix pixels
  ctx.fillStyle = '#1e3a8a';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if ((r + c * 3) % 2 === 0) {
        ctx.fillRect(qrX + 38 + c * 4, qrCenterY + 38 + r * 4, 3.5, 3.5);
      }
    }
  }

  // QR Code text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 16px -apple-system, sans-serif';
  const cleanInit = (name.slice(0, 4) || 'ALUM').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  ctx.fillText(`KODE CHECK-IN: REUNI149-${cleanInit}-2026`, width / 2, qrCenterY + qrSize + 32);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillText('Tunjukkan E-Pass ini pada meja registrasi acara di Griya Oetami', width / 2, qrCenterY + qrSize + 60);

  // Verified Badge Bottom
  ctx.fillStyle = '#16a34a';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.fillText('✓ TIKET RESMI TERKONFIRMASI ALUMNI 2006', width / 2, height - pad - 60);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('Tersimpan di perangkat Anda • Reuni dan Temu Kangen SMPN 149 Jakarta Timur', width / 2, height - pad - 35);

  ctx.restore();

  // Create download link
  const link = document.createElement('a');
  const filenameSafe = (name || 'Alumni-2006').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `E-Pass-Reuni-SMPN149-${filenameSafe}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
