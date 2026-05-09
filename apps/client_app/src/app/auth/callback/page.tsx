"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      Cookies.set("accessToken", accessToken, { path: "/" });
      sessionStorage.removeItem("auth_initialized");
      window.location.replace("/feed");
    } else {
      window.location.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Authorizing...</div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl">Authorizing...</div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
