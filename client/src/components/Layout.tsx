import { useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { Spinner, TopLoader } from "./Loaders";
import { getPending } from "../lib/loading";

const STABLE_TICKS = 3; // page must look "ready" for 3 checks in a row (3 x 100ms)
const MAX_WAIT_MS = 10000; // never block the user longer than this

export default function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const mainRef = useRef<HTMLElement>(null);
  const [busy, setBusy] = useState(true);

  /**
   * Website pages stay behind a loading screen until
   *  1) every request has finished and
   *  2) every <img> on the page has finished loading (or failed).
   * The admin panel skips this gate.
   */
  useLayoutEffect(() => {
    if (isAdmin) {
      setBusy(false);
      return;
    }
    setBusy(true);
    let stable = 0;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const root = mainRef.current;
      const imgs = root ? Array.from(root.querySelectorAll("img")) : [];
      const imagesReady = imgs.every((img) => img.complete);
      const stillLoading = !!root?.querySelector("[data-loading='true']");
      const ready = imagesReady && !stillLoading && getPending() === 0;
      stable = ready ? stable + 1 : 0;
      if (stable >= STABLE_TICKS || Date.now() - started > MAX_WAIT_MS) {
        setBusy(false);
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [pathname, isAdmin]);

  return (
    <>
      <ScrollToTop />
      <TopLoader />
      <AnimatePresence>
        {busy && !isAdmin && (
          <motion.div
            key="gate"
            className="sn-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <img src="/images/logo.svg" alt="" className="sn-gate-logo" />
            <Spinner size={44} />
            <span>Loading, please wait...</span>
          </motion.div>
        )}
      </AnimatePresence>
      {!isAdmin && <AnnouncementBar />}
      <Header />
      <main ref={mainRef}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
