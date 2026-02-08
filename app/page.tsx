"use client";

import { useEffect, useState } from "react";
import { AppProvider, useApp } from "@/lib/context";
import Login from "@/components/Login";
import MainApp from "@/components/MainApp";
import Landing from "@/components/Landing";

function PageContent() {
  const { currentUser } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount, check if user is already logged in (from localStorage)
  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      setShowLanding(false); // Skip landing if already logged in
    } else {
      setIsLoggedIn(false);
    }
    setIsHydrated(true);
  }, [currentUser]);

  // Don't render until hydration is complete (to avoid hydration mismatch)
  if (!isHydrated) {
    return null;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {showLanding ? (
        <Landing onEnter={() => setShowLanding(false)} />
      ) : isLoggedIn ? (
        <MainApp />
      ) : (
        <Login
          onLoginSuccess={() => setIsLoggedIn(true)}
          onBack={() => setShowLanding(true)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <PageContent />
    </AppProvider>
  );
}
