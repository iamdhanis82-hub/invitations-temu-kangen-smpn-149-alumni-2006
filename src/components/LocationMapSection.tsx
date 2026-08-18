import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Compass, Car } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

export const LocationMapSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${EVENT_DETAILS.venue}, ${EVENT_DETAILS.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lokasi-peta" className="py-16 px-4 bg-slate-50 text-slate-800 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Petunjuk Arah & Navigasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mb-3">
            Lokasi Griya Oetami
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Tempat berkumpul yang nyaman dan estetik di kawasan Condet Cililitan, dengan sajian istimewa serta akses mudah dari seluruh Jakarta Timur.
          </p>
        </div>

        {/* Map Container & Address Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Top Address & Actions Bar */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold">
                    TITIK TEMU UTAMA
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-serif text-white">
                  {EVENT_DETAILS.venue}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <span>{EVENT_DETAILS.address}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 flex-shrink-0">
                <button
                  id="btn-copy-address"
                  onClick={handleCopyAddress}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-300" />}
                  <span>{copied ? 'Alamat Tersalin!' : 'Salin Alamat'}</span>
                </button>

                <a
                  id="btn-open-google-maps"
                  href={EVENT_DETAILS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Buka Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-blue-200" />
                </a>

                <a
                  id="btn-open-waze"
                  href={EVENT_DETAILS.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Car className="w-4 h-4 text-white" />
                  <span>Navigasi Waze</span>
                </a>
              </div>
            </div>
          </div>

          {/* Embedded Google Maps iFrame */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-100">
            <iframe
              title="Peta Lokasi Griya Oetami x Koffie Oetami"
              src={EVENT_DETAILS.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Transportation Tips & Landmarks */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
              <span className="font-bold text-blue-700">📍 Patokan:</span>
              <span>Jl. Raya Condet No. 7 Cililitan, dekat kawasan PGC (Pusat Grosir Cililitan), akses jalan utama mudah dijangkau & area parkir tersedia.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
              <span className="font-bold text-blue-700">🚗 Titik Jemput Ojol:</span>
              <span>Ketik <strong className="text-slate-900">"Griya Oetami"</strong> atau <strong className="text-slate-900">"Koffie Oetami"</strong> pada aplikasi Gojek / Grab / Maxim untuk titik pengantaran langsung di lobi.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
