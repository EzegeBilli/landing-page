import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import styles from "./Login.module.css";
import { useAuth } from "../../context/auth/useAuth";
import AuthSidePanel from "../../components/auth-comps/auth-side-panel/AuthSidePanel";
import logo from "../../assets/images/svg/nmulogo.png";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../../components/toast/toast";

const Login = () => {
  const { login } = useAuth();
  const loginMutation = useMutation({ mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password), retry: false, gcTime: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    (location.state as { from?: string } | null)?.from || "/profile";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (loginMutation.isPending) return;
    const result = await loginMutation.mutateAsync({ email, password });
    loginMutation.reset();
    if (result.needsVerification) {
      toast.info("Please verify your email before logging in.");
      sessionStorage.setItem("nmu_verification_email", email.trim().toLowerCase());
      navigate("/verify-email", { state: { email: email.trim().toLowerCase(), from: redirectTo } });
      return;
    }
    if (result.awaitingApproval) {
      navigate("/pending-approval", { state: { email: email.trim().toLowerCase() } });
      return;
    }
    if (!result.ok) {
      toast.error(result.error || "Something went wrong. Please try again.");
      return;
    }

    toast.success("Welcome back. You’re logged in.");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.formCol}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="NMU Alumni Association" />
          </Link>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Log in to access your profile, mentorship requests, and more.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={17} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={17} className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                />
                <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="password">
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
            </div>


            <button type="submit" className={styles.submitBtn} disabled={loginMutation.isPending}>
              <LogIn size={19} strokeWidth={2.25} aria-hidden="true" /> {loginMutation.isPending ? "Logging in…" : "Log In"}
            </button>
          </form>
          <p className={styles.footerText}><Link to="/verify-email" className={styles.link}>Still need to verify your email?</Link></p>

          <p className={styles.footerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.link}>
              Join the Network
            </Link>
          </p>
        </div>
      </div>

      <AuthSidePanel />
    </div>
  );
};

export default Login;
