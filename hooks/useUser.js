"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  const user = useMemo(() => {
    if (status === "authenticated" && session?.user) {
      return session.user;
    }
    return null;
  }, [status, session?.user?._id]);

  return user;
};
