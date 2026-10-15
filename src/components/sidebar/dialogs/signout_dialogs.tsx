"use client";
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
import { useAppSelector } from "@/src/utils/services/store/hook";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";

export default function SignoutDialog() {
  const user = useAppSelector((state) => state.user);
  const navigate = useRouter();

  const handleSignout = async () => {
    if (user.userType === "GUEST") {
      await fetch("/api/guest-logout", {
        method: "POST",
      });
      navigate.push("/");
      return;
    } else {
      return await signOut();
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
              className="rounded-xl border-white/10 hover:border-[#FF6D1F] hover:text-[#FF6D1F] hover:bg-[#FF6D1F]/10 text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSignout}
            type="button"
            variant="destructive"
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

