// The auth state now lives in one shared provider (context/AuthContext.tsx).
// This file keeps the old import path working for every page.
export { useAuth } from "../context/AuthContext";
