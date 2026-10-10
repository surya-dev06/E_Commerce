import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, UserRound } from "lucide-react";
import { supabase } from "../lib/supabase";
function Shell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <div className="auth-orbit orbit-a" />
      <div className="auth-orbit orbit-b" />
      <div className="auth-visual">
        <span>VOLTIX</span>
        <h2>
          Technology
          <br />
          <em>with intention.</em>
        </h2>
        <p>
          Premium electronics, secure checkout and a smarter shopping
          experience.
        </p>
        <div className="float-device laptop-device">LAPTOP</div>
        <div className="float-device phone-device">PHONE</div>
      </div>
      <div className="auth-card">
        <Link to="/">
          <img src="/images/logo.svg" alt="Voltix" />
        </Link>
        <span className="auth-kicker">WELCOME TO VOLTIX</span>
        <h1>{title}</h1>
        <p>{sub}</p>
        {children}
      </div>
    </div>
  );
}
function Otp({
  email,
  name,
  onBack,
}: {
  email: string;
  name?: string;
  onBack: () => void;
}) {
  const [code, setCode] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    nav = useNavigate();
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) setError(error.message);
    else {
      if (name && data.user)
        await supabase
          .from("profiles")
          .update({ full_name: name })
          .eq("id", data.user.id);
      nav("/");
    }
    setLoading(false);
  }
  async function resend() {
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) setError(error.message);
  }
  return (
    <Shell
      title="Enter your code"
      sub={`We sent a 6-digit verification code to ${email}.`}
    >
      <form className="auth-form" onSubmit={verify}>
        <div className="otp-box">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              inputMode="numeric"
              maxLength={1}
              value={code[i] || ""}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                const a = code.split("");
                a[i] = v;
                setCode(a.join(""));
                if (v)
                  (
                    e.currentTarget
                      .nextElementSibling as HTMLInputElement | null
                  )?.focus();
              }}
            />
          ))}
        </div>
        <button
          className="primary-btn wide"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Verifying..." : "Verify & Continue"}{" "}
          <ArrowRight size={17} />
        </button>
        {error && <p className="error">{error}</p>}
        <button type="button" className="text-btn" onClick={resend}>
          Resend code
        </button>
        <button type="button" className="text-btn" onClick={onBack}>
          Use another email
        </button>
      </form>
    </Shell>
  );
}
export function Register() {
  const [email, setEmail] = useState(""),
    [name, setName] = useState(""),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { full_name: name } },
    });
    if (error) setError(error.message);
    else setSent(true);
  }
  if (sent)
    return <Otp email={email} name={name} onBack={() => setSent(false)} />;
  return (
    <Shell
      title="Create your account"
      sub="Join a modern electronics store built around a better experience."
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          <UserRound />
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          <Mail />
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button className="primary-btn wide">
          Send OTP <ArrowRight size={17} />
        </button>
        {error && <p className="error">{error}</p>}
        <div className="or">OR</div>
        <button
          type="button"
          className="google-btn"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: `${location.origin}/auth/callback` },
            })
          }
        >
          Continue with Google
        </button>
        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </Shell>
  );
}
export function Login() {
  const [email, setEmail] = useState(""),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    if (error) setError(error.message);
    else setSent(true);
  }
  if (sent) return <Otp email={email} onBack={() => setSent(false)} />;
  return (
    <Shell
      title="Welcome back"
      sub="Sign in securely with a one-time email code."
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          <Mail />
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <button className="primary-btn wide">
          Send Login OTP <ArrowRight size={17} />
        </button>
        {error && <p className="error">{error}</p>}
        <div className="or">OR</div>
        <button
          type="button"
          className="google-btn"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: `${location.origin}/auth/callback` },
            })
          }
        >
          Continue with Google
        </button>
        <p className="auth-foot">
          New here? <Link to="/register">Create account</Link>
        </p>
      </form>
    </Shell>
  );
}
export function VerifyEmail() {
  return (
    <div className="center-page">
      <div className="success-box">
        <ShieldCheck size={45} />
        <h1>Email verification</h1>
        <p>
          Your account uses OTP verification. Return to the login screen and
          request a fresh code if needed.
        </p>
        <Link className="primary-btn" to="/login">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
export function AuthCallback() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav("/"), 700);
    return () => clearTimeout(t);
  }, [nav]);
  return (
    <div className="center-page">
      <div className="success-box">
        <div className="spinner" />
        Signing you in securely...
      </div>
    </div>
  );
}
