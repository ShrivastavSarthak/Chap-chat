"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/lib/components/ui/avatar";
import { Button } from "@/src/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/src/lib/components/ui/dropdown-menu";
import { useSidebar } from "@/src/lib/components/ui/sidebar";
import { text_size } from "@/src/utils/constants/css.constants";
import { useAppSelector } from "@/src/utils/services/store/hook";
import SignoutDialog from "./dialogs/signout_dialogs";

export default function AppSidebarFooter() {
  const user = useAppSelector((state) => state.user);
  const { open, isMobile } = useSidebar();

  // ✅ Always show expanded state on mobile
  const isOpen = isMobile ? true : open;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button variant="ghost" className="cursor-pointer w-full">
          <Avatar>
            <Avatar>
              <AvatarImage
                src={user?.image}
                alt="User Avatar"
                className="w-[40px] h-[40px] rounded-full"
              />
              <AvatarFallback className="bg-[#FF6D1F]">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Avatar>
          {isOpen && (
            <p className={`${text_size.p3} font-semibold text-[#222222]`}>
              {user.name}
            </p>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-[#222222] border-[#FF6D1F]"
        align="start"
      >
        <DropdownMenuLabel className="text-[#F5E7C6]">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#FF6D1F]" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[#F5E7C6]"
          onSelect={(e) => e.preventDefault()}
        >
          <SignoutDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
