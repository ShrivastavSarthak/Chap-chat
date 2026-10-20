"use client";
import { useAppSelector } from "@/src/utils/services/store/hook";
import { Sparkles, Lightbulb, Code2, PenLine, Cpu } from "lucide-react";

const PROMPT_SUGGESTIONS = [
  {
    icon: Lightbulb,
    title: "Brainstorm Ideas",
    prompt: "Give me 5 creative concept ideas for a modern AI productivity tool.",
  },
  {
    icon: Code2,
    title: "Code Assistance",
    prompt: "Write a high-performance custom debounce hook in TypeScript for React.",
  },
  {
    icon: PenLine,
    title: "Draft an Email",
    prompt: "Draft a concise, polite follow-up email after an executive product demo.",
  },
  {
    icon: Cpu,
    title: "Explain Complex Tech",
    prompt: "Explain how transformer neural networks work using a simple everyday analogy.",
  },
];

export default function Suggestions() {
  const chat = useAppSelector((state) => state.chats);

  if (chat.length > 0) return null;

  const handleSelectPrompt = (prompt: string) => {
    // Dispatch custom event that ChatInput listens to
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("chapchat:set-prompt", { detail: prompt })
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto px-3 py-6 pb-40 sm:pb-48 select-none">
      <div className="w-full max-w-[780px] flex flex-col items-center my-auto animate-in fade-in zoom-in-95 duration-500">
        {/* AI Sparkle Icon Badge */}
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6D1F]/20 via-[#FF6D1F]/10 to-transparent border border-[#FF6D1F]/30 flex items-center justify-center shadow-[0_0_35px_rgba(255,109,31,0.25)]">
            <Sparkles className="w-7 h-7 text-[#FF6D1F]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FF6D1F] border-2 border-[#090A0F] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Greeting Title */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center">
          What can I help you discover today?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 text-center max-w-md mt-2 mb-7 leading-relaxed">
          Select a suggestion below or type your question in the prompt box to
          begin intelligent reasoning.
        </p>

        {/* Suggestion Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROMPT_SUGGESTIONS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(item.prompt)}
                className="group flex flex-col items-start p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#FF6D1F]/40 transition-all duration-200 text-left shadow-sm hover:shadow-[0_4px_20px_rgba(255,109,31,0.15)] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FF6D1F]/10 border border-[#FF6D1F]/20 flex items-center justify-center text-[#FF6D1F] group-hover:scale-105 transition-transform">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

