"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import CyberLoader from "./CyberLoader";

const isPublicRoute = (pathname) => {
  const publicPaths = ["/api/auth/signin", "/reset-password"];

  return publicPaths.some((publicPath) => pathname.startsWith(publicPath));
};

const withAuth = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isPublicRoute(pathname)) {
        if (status === "unauthenticated") {
          const callbackUrl = encodeURIComponent(pathname);
          router.push(`/api/auth/signin?callbackUrl=${callbackUrl}`);
        }
      }
    }, [status, router, pathname]);

    if (status === "loading" && !isPublicRoute(pathname)) {
      return <CyberLoader />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithAuth;
};

export default withAuth;
