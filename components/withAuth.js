"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import PageLoader from "./PageLoader";

const withAuth = (WrappedComponent, options = {}) => {
  const { publicRoutes = [] } = options;
  const defaultPublicRoutes = [
    "/api/auth/signin",
    "qpi/auth/register",
    ...publicRoutes,
  ];

  const ComponentWithAuth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const isProtectedRoute = !defaultPublicRoutes.some((publicPath) =>
      pathname.startsWith(publicPath)
    );

    useEffect(() => {
      if (isProtectedRoute && status === "unauthenticated") {
        const callbackUrl = encodeURIComponent(pathname);
        router.push(`/api/auth/signin?callbackUrl=${callbackUrl}`);
      }
    }, [status, router, pathname, isProtectedRoute]);
    if (isProtectedRoute && status === "loading") {
      return <PageLoader />;
    }
    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithAuth;
};

export default withAuth;
