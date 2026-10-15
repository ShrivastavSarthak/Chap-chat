"use client";
import { useAppSelector } from "@/src/utils/services/store/hook";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User } from "lucide-react";

export default function ChatsScreen() {
  const isChatLoading = useAppSelector((state) => state.loading.chatLoading);
  const chats = useAppSelector((state) => state.chats);
  const user = useAppSelector((state) => state.user);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isChatLoading]);

  return (
    <div className="w-full h-full flex justify-center items-start overflow-y-auto py-4 px-1 sm:px-3">
      <div className="w-full max-w-[820px] flex flex-col gap-5">
        {chats.map((chat, i) => (
          <div key={chat.id || i} className="w-full flex flex-col gap-4">
            {/* User Message Bubble */}
            {chat.user && (
              <div className="w-full flex justify-end items-end gap-2.5">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-xs px-4 py-3 bg-gradient-to-r from-[#FF6D1F] via-[#FF7D32] to-[#FF6D1F] text-white shadow-md text-sm sm:text-base leading-relaxed break-words selection:bg-black/30">
                  {chat.user}
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 text-xs shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
              </div>
            )}

            {/* Assistant Message Bubble */}
            {chat.assistant &&
              chat.assistant.map((assistantMsg, index) => (
                <div key={index} className="w-full flex justify-start items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F] shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="w-full max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-xs p-4 sm:p-5 bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-100 shadow-md">
                    <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed break-words font-normal text-zinc-200">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          code: ({ className, children, ...props }) => {
                            const isInline = !className?.includes("language-");
                            if (isInline) {
                              return (
                                <code
                                  className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-xs font-medium"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <pre className="bg-zinc-950/90 border border-white/10 rounded-xl p-3.5 my-3 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-200">
                                <code {...props}>{children}</code>
                              </pre>
                            );
                          },
                          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-zinc-200">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-zinc-200">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#FF6D1F] pl-3 italic text-zinc-300 my-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {assistantMsg}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

            {/* Thinking / Loading Indicator on Latest Prompt */}
            {i === chats.length - 1 && isChatLoading && (
              <div className="w-full flex justify-start items-center gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F] shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-300 text-xs sm:text-sm flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D1F] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D1F] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6D1F] animate-bounce" />
                  </span>
                  <span>Chap-Chat is thinking...</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Invisible anchor for auto-scrolling */}
        <div ref={bottomRef} className="h-1" />

        {/* Generous bottom spacer so the conversation never gets hidden behind the fixed text area */}
        <div
          className="h-44 sm:h-52 shrink-0 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

