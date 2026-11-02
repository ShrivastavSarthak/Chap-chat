"use client";

import { ReactNode, useEffect } from "react";
import { UserInterface } from "../utils/interface/userInterface";
import { useAppDispatch } from "../utils/services/store/hook";
import { setUserData } from "../utils/services/store/slice/user";

export default function ReduxHydrate({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: UserInterface;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialUser && (initialUser.id || initialUser.name)) {
      dispatch(setUserData(initialUser));
    }
  }, [initialUser, dispatch]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col flex-1">
      {children}
    </div>
  );
}

