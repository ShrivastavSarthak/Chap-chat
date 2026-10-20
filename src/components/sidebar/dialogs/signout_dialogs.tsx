"use client";
import { logoutUser } from "@/src/app/(main)/(login)/action";
import { Button } from "@/src/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/lib/components/ui/dialog";
import { useAppDispatch } from "@/src/utils/services/store/hook";
import { resetChats } from "@/src/utils/services/store/slice/chat";
import { setUserData } from "@/src/utils/services/store/slice/user";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignoutDialog() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    try {
      setIsLoading(true);

      // 1. Clear all server-side cookies (httpOnly cookies like access_token, user_id, guestSessionId)
      await logoutUser();

      // 2. Clear all client-side cookies on localhost
      if (typeof document !== "undefined") {
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
          }
        });
      }

      // 3. Clear NextAuth session if active
      try {
        await signOut({ redirect: false });
      } catch {
        // Fallback if NextAuth is inactive
      }

      // 4. Reset Redux store
      dispatch(
        setUserData({
          email: "",
          image: "",
          name: "",
          userType: "",
        }),
      );
      dispatch(resetChats());

      toast.success("Signed out successfully");

      // 5. Redirect cleanly to login root page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <button
          type="button"
          className="w-full flex items-center gap-2 cursor-pointer text-left"
        >
          <HiOutlineLogout className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400">Sign out</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Confirm Sign Out
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-zinc-400 leading-relaxed my-2">
          Are you sure you want to end your current session? You can sign back in
          at any time.
        </p>
        <DialogFooter className="gap-2 sm:gap-3 pt-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="rounded-xl border-white/10 hover:border-[#FF6D1F] hover:text-[#FF6D1F] hover:bg-[#FF6D1F]/10 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSignout}
            type="button"
            disabled={isLoading}
            variant="destructive"
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing out...</span>
              </>
            ) : (
              <span>Sign out</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
