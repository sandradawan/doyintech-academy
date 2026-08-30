import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export type CertificateData = {
  recipientName: string;
  courseTitle: string;
  certificateId: string;
  issuedAt: string;
  score?: number;
};

/**
 * Unique Doyintech Academy certificate.
 * Blends formal navy/gold framing with modern wave geometry,
 * in Academy brand: white · black · blue · orange.
 */
export function CertificateTemplate({
  data,
  className,
}: {
  data: CertificateData;
  className?: string;
}) {
  const dateLabel = formatDate(data.issuedAt);

  return (
    <figure
      className={cn(
        "relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-sm bg-white text-[#0B0E14] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]",
        className,
      )}
      aria-label={`Certificate for ${data.recipientName}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 707"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cert-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="cert-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="cert-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        <path fill="url(#cert-blue)" d="M0 0h220L0 160V0z" />
        <path fill="url(#cert-blue)" d="M1000 0H780l220 160V0z" />
        <path fill="url(#cert-blue)" d="M0 707h200L0 560v147z" />
        <path fill="url(#cert-blue)" d="M1000 707H800l200-147v147z" />

        <path fill="none" stroke="url(#cert-gold)" strokeWidth="6" d="M40 120C120 40 200 20 280 20" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="6" d="M960 120C880 40 800 20 720 20" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="8" d="M0 620C180 680 320 700 480 700" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="8" d="M1000 620C820 680 680 700 520 700" />

        <path fill="url(#cert-wave)" d="M620 0c80 120 160 200 280 280 40 28 80 50 100 70V0H620z" />
        <path fill="none" stroke="#F97316" strokeOpacity="0.35" strokeWidth="2" d="M680 40c90 100 170 180 280 250" />
        <path fill="none" stroke="#2563EB" strokeOpacity="0.25" strokeWidth="2" d="M720 20c100 110 190 200 260 280" />

        <rect x="36" y="36" width="928" height="635" fill="none" stroke="#E2E8F0" strokeWidth="2" rx="4" />
        <rect x="48" y="48" width="904" height="611" fill="none" stroke="#FBBF24" strokeOpacity="0.55" strokeWidth="1" rx="2" />
      </svg>

      <div className="relative flex h-full flex-col px-[7%] py-[5%]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="size-11" />
            <div>
              <p className="font-display text-sm font-semibold tracking-tight text-[#0B0E14]">
                Doyin<span className="text-[#2563EB]">Tech</span>
              </p>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#F97316] uppercase">Academy</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium tracking-[0.14em] text-[#64748B] uppercase">Certificate ID</p>
            <p className="mt-0.5 font-mono text-xs font-medium tracking-wide text-[#0B0E14]">{data.certificateId}</p>
          </div>
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <p className="font-display text-4xl font-medium tracking-tight text-[#1E3A8A] sm:text-5xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Certificate
          </p>
          <p className="mt-1 text-sm font-medium tracking-[0.28em] text-[#F97316] uppercase">of Completion</p>
          <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent" />
          <p className="mt-4 text-xs font-medium tracking-[0.2em] text-[#64748B] uppercase">This certifies that</p>
        </div>

        <div className="mt-3 text-center">
          <p className="text-3xl font-medium tracking-tight text-[#0B0E14] sm:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {data.recipientName}
          </p>
          <div className="mx-auto mt-2 h-0.5 w-48 max-w-[60%] bg-[#E2E8F0]" />
        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-[#64748B]">
          has successfully completed the course{" "}
          <span className="font-semibold text-[#0B0E14]">{data.courseTitle}</span>
          {data.score != null ? (
            <>
              {" "}with a final assessment score of{" "}
              <span className="font-semibold text-[#2563EB]">{data.score}%</span>
            </>
          ) : null}
          , demonstrating the skills and standards of Doyintech Academy.
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-8">
          <div className="min-w-[7rem]">
            <div className="h-px w-full bg-[#CBD5E1]" />
            <p className="mt-2 text-[10px] font-medium tracking-[0.16em] text-[#94A3B8] uppercase">Date</p>
            <p className="mt-0.5 text-sm font-medium text-[#0B0E14]">{dateLabel}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex size-20 items-center justify-center">
              <svg viewBox="0 0 80 80" className="absolute inset-0 size-full" aria-hidden="true">
                <circle cx="40" cy="40" r="36" fill="#F97316" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#FBBF24" strokeWidth="2" />
                <path d="M40 18l3.5 10.5H54l-8.5 6.5 3.2 10.5L40 39.5 31.3 45.5l3.2-10.5L26 28.5h10.5L40 18z" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="relative flex size-16 items-center justify-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0 size-full" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="#1E3A8A" />
                <circle cx="32" cy="32" r="24" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
                <text x="32" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="700">DOYIN</text>
                <text x="32" y="40" textAnchor="middle" fill="#F97316" fontSize="6" fontFamily="system-ui,sans-serif" fontWeight="700">TECH</text>
              </svg>
            </div>
          </div>

          <div className="min-w-[7rem] text-right">
            <div className="ml-auto h-px w-full bg-[#CBD5E1]" />
            <p className="mt-2 text-[10px] font-medium tracking-[0.16em] text-[#94A3B8] uppercase">Faculty</p>
            <p className="mt-0.5 text-sm font-medium text-[#0B0E14]">Silas D. Jonathan</p>
            <p className="text-[10px] text-[#64748B]">Founder, DoyinTech</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function CertificatePreview() {
  return (
    <CertificateTemplate
      data={{
        recipientName: "Adaeze Okonkwo",
        courseTitle: "React Essentials",
        certificateId: "DTA-REA-7K2M",
        issuedAt: "2026-08-30",
        score: 92,
      }}
    />
  );
}
