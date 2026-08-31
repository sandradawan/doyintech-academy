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
 * Doyintech Academy certificate of completion.
 * Landscape A4-ish ratio · safe inner margins · high-contrast text.
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
        "relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-sm bg-white text-[#0B0E14]",
        "shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]",
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
          <linearGradient id="cert-navy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="cert-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="55%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        <rect x="14" y="14" width="972" height="679" fill="none" stroke="#1E3A8A" strokeWidth="10" />
        <rect x="28" y="28" width="944" height="651" fill="none" stroke="url(#cert-gold)" strokeWidth="3" />
        <rect x="40" y="40" width="920" height="627" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />

        <path fill="url(#cert-navy)" d="M14 14h90L14 90V14z" />
        <path fill="url(#cert-navy)" d="M986 14H896l90 76V14z" />
        <path fill="url(#cert-navy)" d="M14 693h90L14 617v76z" />
        <path fill="url(#cert-navy)" d="M986 693H896l90-76v76z" />

        <path fill="none" stroke="url(#cert-gold)" strokeWidth="4" d="M55 55h40M55 55v40" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="4" d="M945 55h-40M945 55v40" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="4" d="M55 652h40M55 652v-40" />
        <path fill="none" stroke="url(#cert-gold)" strokeWidth="4" d="M945 652h-40M945 652v-40" />
      </svg>

      <div className="relative box-border flex h-full flex-col px-[9%] py-[6.5%]">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <LogoMark className="size-9 shrink-0 sm:size-11" />
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold tracking-tight text-[#0B0E14] sm:text-sm">
                Doyin<span className="text-[#2563EB]">Tech</span>
              </p>
              <p className="text-[9px] font-semibold tracking-[0.18em] text-[#F97316] uppercase sm:text-[10px]">
                Academy
              </p>
            </div>
          </div>
          <div className="max-w-[42%] shrink-0 text-right">
            <p className="text-[9px] font-semibold tracking-[0.14em] text-[#64748B] uppercase sm:text-[10px]">
              Certificate ID
            </p>
            <p className="mt-0.5 break-all font-mono text-[10px] font-semibold tracking-wide text-[#0B0E14] sm:text-xs">
              {data.certificateId}
            </p>
          </div>
        </header>

        <div className="mt-3 shrink-0 text-center sm:mt-4">
          <p
            className="text-[1.65rem] leading-none font-semibold tracking-tight text-[#1E3A8A] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            Certificate
          </p>
          <p className="mt-1.5 text-[11px] font-semibold tracking-[0.28em] text-[#F97316] uppercase sm:text-sm">
            of Completion
          </p>
          <div
            className="mx-auto mt-2.5 h-[2px] w-20 rounded-full sm:mt-3 sm:w-28"
            style={{
              background:
                "linear-gradient(90deg, transparent, #FBBF24 20%, #F97316 50%, #FBBF24 80%, transparent)",
            }}
          />
        </div>

        <div className="mt-3 shrink-0 text-center sm:mt-4">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#64748B] uppercase sm:text-xs">
            This certifies that
          </p>
          <p
            className="mt-1.5 px-1 text-[1.35rem] leading-tight font-semibold tracking-tight text-[#0B0E14] sm:mt-2 sm:text-3xl md:text-4xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            {data.recipientName}
          </p>
          <div className="mx-auto mt-2 h-px w-36 max-w-[55%] bg-[#CBD5E1] sm:mt-2.5 sm:w-52" />
        </div>

        <div className="mx-auto mt-3 flex min-h-0 w-full max-w-[36rem] flex-1 flex-col justify-center px-1 sm:mt-4">
          <p className="text-center text-[11px] leading-[1.55] text-[#334155] sm:text-sm sm:leading-relaxed">
            has successfully completed the course of study
          </p>
          <p
            className="mt-1.5 text-center text-base leading-snug font-semibold text-[#0B0E14] sm:mt-2 sm:text-xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            {data.courseTitle}
          </p>
          <p className="mt-2 text-center text-[11px] leading-[1.55] text-[#334155] sm:mt-2.5 sm:text-sm sm:leading-relaxed">
            {data.score != null ? (
              <>
                with a final assessment score of{" "}
                <span className="font-bold text-[#2563EB]">{data.score}%</span>
                , meeting the standards of{" "}
                <span className="font-semibold text-[#0B0E14]">Doyintech Academy</span>
                {" "}and demonstrating readiness to apply these skills in practice.
              </>
            ) : (
              <>
                meeting the standards of{" "}
                <span className="font-semibold text-[#0B0E14]">Doyintech Academy</span>
                {" "}and demonstrating readiness to apply these skills in practice.
              </>
            )}
          </p>
        </div>

        <footer className="mt-3 flex shrink-0 flex-wrap items-end justify-between gap-3 pt-1 sm:mt-4 sm:gap-4">
          <div className="min-w-[5.5rem] flex-1 sm:min-w-[7rem]">
            <div className="h-px w-full max-w-[9rem] bg-[#CBD5E1]" />
            <p className="mt-1.5 text-[9px] font-semibold tracking-[0.16em] text-[#94A3B8] uppercase sm:text-[10px]">
              Date issued
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#0B0E14] sm:text-sm">{dateLabel}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <svg viewBox="0 0 80 80" className="size-12 sm:size-16" aria-hidden="true">
              <circle cx="40" cy="40" r="36" fill="#F97316" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#FBBF24" strokeWidth="2" />
              <path
                d="M40 18l3.5 10.5H54l-8.5 6.5 3.2 10.5L40 39.5 31.3 45.5l3.2-10.5L26 28.5h10.5L40 18z"
                fill="#FFFFFF"
              />
            </svg>
            <svg viewBox="0 0 64 64" className="size-10 sm:size-14" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#1E3A8A" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
              <text
                x="32"
                y="30"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="7"
                fontFamily="system-ui,sans-serif"
                fontWeight="700"
              >
                DOYIN
              </text>
              <text
                x="32"
                y="40"
                textAnchor="middle"
                fill="#F97316"
                fontSize="6"
                fontFamily="system-ui,sans-serif"
                fontWeight="700"
              >
                TECH
              </text>
            </svg>
          </div>

          <div className="min-w-[5.5rem] flex-1 text-right sm:min-w-[7rem]">
            <div className="ml-auto h-px w-full max-w-[9rem] bg-[#CBD5E1]" />
            <p className="mt-1.5 text-[9px] font-semibold tracking-[0.16em] text-[#94A3B8] uppercase sm:text-[10px]">
              Authorized by
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#0B0E14] sm:text-sm">Silas D. Jonathan</p>
            <p className="text-[9px] text-[#64748B] sm:text-[10px]">Founder, DoyinTech</p>
          </div>
        </footer>
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
