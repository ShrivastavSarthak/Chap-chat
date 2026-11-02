"use server";
import ReduxHydrate from "@/src/components/reduxHydrate";
import { AppSidebar } from "@/src/components/sidebar/sideBar";
import { SidebarProvider } from "@/src/lib/components/ui/sidebar";
import { FetchUserDetails } from "./action";
import MobileSidebar from "@/src/components/sidebar/mobileSidebar";

import { cookies } from "next/headers";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await FetchUserDetails();
  const cookieStore = await cookies();
  const userId =
    cookieStore.get("user_id")?.value ||
    cookieStore.get("guestSessionId")?.value ||
    "";
  const userRole =
    cookieStore.get("user_role")?.value ||
    (cookieStore.get("guestSessionId")?.value ? "guest" : (userId ? "user" : "guest"));
  const userName =
    cookieStore.get("user_name")?.value ||
    (userRole === "guest" ? "Guest" : "");
  const userEmail =
    cookieStore.get("user_email")?.value ||
    cookieStore.get("email")?.value ||
    "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative flex-1 min-w-0 w-full h-screen flex flex-col bg-[#090A0F] text-zinc-100 overflow-hidden selection:bg-[#FF6D1F]/30 selection:text-white">
        {/* Ambient atmospheric background glows */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,109,31,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none"
        />
        <MobileSidebar />
        <div className="relative z-10 flex-1 min-h-0 w-full h-full overflow-hidden flex flex-col">
          <ReduxHydrate
            initialUser={{
              id: userId,
              name: userName,
              email: userEmail,
              image: "",
              userType: userRole === "guest" ? "GUEST" : "USER",
              role: userRole,
            }}
          >
            {children}
          </ReduxHydrate>
        </div>
      </main>
    </SidebarProvider>
  );
}

