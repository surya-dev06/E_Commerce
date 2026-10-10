import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { usePending } from "../lib/loading";

/** Small round spinner – use it inside buttons or next to text. */
export function Spinner({ size = 22 }: { size?: number }) {
  return (
    <span
      className="sn-spinner"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 9) }}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Centered loader used while a page / section is waiting for data. */
export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="page-loader sn-page-loader" data-loading="true">
      <Spinner size={38} />
      <span>{label}</span>
    </div>
  );
}

/** Thin progress bar at the top of the screen – shows for every network request. */
export function TopLoader() {
  const pending = usePending();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (pending === 0) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, [pending]);
  return show ? <div className="sn-toploader" aria-hidden="true"><i /></div> : null;
}

/** Placeholder cards while products are loading. */
export function ProductSkeletons({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="sn-skel-card" key={i} data-loading="true">
          <div className="sn-skel sn-skel-img" />
          <div className="sn-skel sn-skel-line" />
          <div className="sn-skel sn-skel-line short" />
          <div className="sn-skel sn-skel-btn" />
        </div>
      ))}
    </>
  );
}

/** <img> that swaps to a local fallback if the remote image fails. */
export function SafeImg({
  fallback = "/images/laptop.svg",
  src,
  onError,
  alt = "",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <img
      {...rest}
      alt={alt}
      src={failed || !src ? fallback : src}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
