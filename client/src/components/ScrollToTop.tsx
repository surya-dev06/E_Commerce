import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Every navigation (footer links, header links, buttons, back/forward) opens
 * the new page at the very top.
 * In-page updates (typing in the shop search box) pass
 * `state: { keepScroll: true }` so the page does not jump.
 */
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  const keepScroll = !!(location.state as any)?.keepScroll;
  useLayoutEffect(() => {
    if (keepScroll) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.key, location.pathname, location.search, keepScroll]);

  return null;
}
