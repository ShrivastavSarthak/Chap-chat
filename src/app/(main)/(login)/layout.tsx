import { media } from "@/public";
import Image from "next/image";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-[#08090D] text-zinc-100 flex items-center justify-center relative overflow-hidden selection:bg-[#FF6D1F]/30 selection:text-white">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(255,109,31,0.15)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto items-center">
        {/* Left Hero Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 h-full min-h-[640px] max-h-[860px]">
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between p-8 xl:p-10 group">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controls={false}
              className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
            >
              <source src={media.MainBanner} type="video/mp4" />
            </video>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(8,9,13,0.7)_100%)] z-10" />

            {/* Top Badge */}
            <div className="relative z-20 flex items-center justify-between">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-xs font-medium text-zinc-300 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6D1F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6D1F]" />
                </span>
                <span>Next-Gen AI Workspace</span>
              </div>
            </div>

            {/* Bottom Content & Branding */}
            <div className="relative z-20 flex flex-col gap-5 pt-8">
              <div className="w-full max-w-[420px]">
                <Image
                  src={media.bannerlogo}
                  alt="Chap-Chat Logo"
                  className="w-auto h-auto max-h-[70px] object-contain drop-shadow-[0_4px_16px_rgba(255,109,31,0.25)]"
                  width={420}
                  height={140}
                  priority
                />
              </div>

              <div>
                <h3 className="text-xl xl:text-2xl font-semibold text-zinc-100 tracking-tight leading-snug">
                  Let’s empower your growth through AI
                </h3>
                <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
                  Seamless multi-model intelligence, unified conversations, and
                  accelerated productivity designed for modern teams.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-[#FF6D1F]" />
                  <span>Real-time Speed</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF6D1F]" />
                  <span>Private & Encrypted</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6D1F]" />
                  <span>Multi-Model AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Area */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex justify-center items-center py-6 sm:py-10">
          <div className="w-full max-w-[520px] flex flex-col justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

