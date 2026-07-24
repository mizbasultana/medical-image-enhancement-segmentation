import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Landing } from "@/pages/Landing";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { SkeletonGrid } from "@/components/ui/skeleton";
import { WelcomeScreen } from "@/components/WelcomeScreen";

const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Upload = lazy(() => import("@/pages/Upload").then((m) => ({ default: m.Upload })));
const Enhancement = lazy(() => import("@/pages/Enhancement").then((m) => ({ default: m.Enhancement })));
const Segmentation = lazy(() => import("@/pages/Segmentation").then((m) => ({ default: m.Segmentation })));
const GradCam = lazy(() => import("@/pages/GradCam").then((m) => ({ default: m.GradCam })));
const Analytics = lazy(() => import("@/pages/Analytics").then((m) => ({ default: m.Analytics })));
const Reports = lazy(() => import("@/pages/Reports").then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const Research = lazy(() => import("@/pages/Research").then((m) => ({ default: m.Research })));

function PageLoader() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SkeletonGrid />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-5 h-[300px] skeleton" />
        </div>
        <div className="glass-card p-5 h-[300px] skeleton" />
      </div>
    </div>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("welcomeDismissed");
    if (dismissed === "true") setShowWelcome(false);
  }, []);

  const handleWelcomeComplete = () => {
    sessionStorage.setItem("welcomeDismissed", "true");
    setShowWelcome(false);
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/upload"
            element={
              <Suspense fallback={<PageLoader />}>
                <Upload />
              </Suspense>
            }
          />
          <Route
            path="/enhancement"
            element={
              <Suspense fallback={<PageLoader />}>
                <Enhancement />
              </Suspense>
            }
          />
          <Route
            path="/segmentation"
            element={
              <Suspense fallback={<PageLoader />}>
                <Segmentation />
              </Suspense>
            }
          />
          <Route
            path="/grad-cam"
            element={
              <Suspense fallback={<PageLoader />}>
                <GradCam />
              </Suspense>
            }
          />
          <Route
            path="/analytics"
            element={
              <Suspense fallback={<PageLoader />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="/reports"
            element={
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            }
          />
          <Route
            path="/research"
            element={
              <Suspense fallback={<PageLoader />}>
                <Research />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
