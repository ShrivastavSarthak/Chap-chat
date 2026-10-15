"use client";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "../utils/services/store/hook";
import { setUserData } from "../utils/services/store/slice/user";
import { UserInterface } from "../utils/interface/userInterface";

export default function SessionManager({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user) {
      const userDetails: UserInterface = {
        name: session.user?.name ?? "Guest",
        email: session.user?.email ?? "",
        image: session.user?.image ?? "",
        userType: session.user.email ? "USER" : "GUEST",
      };
      dispatch(setUserData(userDetails));
    }
  }, [session, dispatch]);
  return children;
}
