import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAccount, resendOtp, verifyEmail } from "../../api/auth";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import styles from "./Register.module.css";
import { DISCIPLINES, DISCIPLINE_GROUPS, GRADUATION_YEARS } from "../../constants/Disciplines";
import AuthSidePanel from "../../components/auth-comps/auth-side-panel/AuthSidePanel";
import logo from "../../assets/images/svg/nmulogo.png";
import { toast } from "../../components/toast/toast";

const STEPS = ["Basic Info", "Security", "Academic Details"];

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const Register = ({ verificationEmail = "" }: { verificationEmail?: string }) => {
  const navigate = useNavigate();
  const registration = useMutation({ mutationFn: registerAccount, retry: false, gcTime: 0 });
  const verification = useMutation({ mutationFn: verifyEmail, retry: false, gcTime: 0 });
  const resend = useMutation({ mutationFn: resendOtp, retry: false, gcTime: 0 });
  const otpRequestInFlight = useRef(false);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resendMessage, setResendMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState(verificationEmail);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!resendAvailableAt || verified) return;
    const updateCountdown = () => setResendSeconds(Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000)));
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [resendAvailableAt, verified]);

  const handleResendOtp = async () => {
    if (!registeredEmail || verified || otpRequestInFlight.current || Date.now() < resendAvailableAt) return;
    otpRequestInFlight.current = true;
    setResendMessage("");
    verification.reset();
    try {
      const result = await resend.mutateAsync({ email: registeredEmail });
      setResendMessage(result.message || "If that account is awaiting verification, a new code has been sent.");
      setOtp("");
      setResendAvailableAt(Date.now() + 60000);
      setResendSeconds(60);
      toast.success(result.message || "If that account is awaiting verification, a new code has been sent.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not resend the code. Please try again."); }
    finally { otpRequestInFlight.current = false; }
  };

  const [step, setStep] = useState(1);
  const setStepError = (message: string) => { if (message) toast.error(message); };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [memberType, setMemberType] = useState<"alumni" | "staff">("alumni");
  const [graduationYear, setGraduationYear] = useState(GRADUATION_YEARS[0]);
  const [discipline, setDiscipline] = useState(DISCIPLINES[0]);

  const goNext = () => {
    setStepError("");

    if (step === 1) {
      if (fullName.trim().length < 2 || !email.trim()) {
        setStepError("Please enter a name of at least 2 characters and your email.");
        return;
      }
      if (!isValidEmail(email)) {
        setStepError("Please enter a valid email address.");
        return;
      }
    }

    if (step === 2) {
      if (password.length < 8) {
        setStepError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setStepError("Passwords do not match.");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleCreateAccount = async () => {
    if (registration.isPending) return;
    setStepError("");
    if (fullName.trim().length < 2 || !isValidEmail(email.trim()) || password.length < 8 || password !== confirmPassword) {
      setStepError("Please check your name, email and matching passwords (at least 8 characters).");
      return;
    }
    const year = Number(graduationYear);
    if (memberType === "alumni" && (!Number.isInteger(year) || year < 1950 || year > 2100)) {
      setStepError("Graduation year must be between 1950 and 2100.");
      return;
    }
    try {
      await registration.mutateAsync({
        fullName: fullName.trim(), email: email.trim().toLowerCase(), password,
        userType: memberType, membershipType: memberType === "staff" ? "associate" : "full",
        ...(memberType === "alumni" ? { graduationYear: year, department: discipline } : {}),
      });
      setRegisteredEmail(email.trim().toLowerCase());
      toast.success("Registered. Check your email for the verification code.");
      sessionStorage.setItem("nmu_verification_email", email.trim().toLowerCase());
      setPassword(""); setConfirmPassword("");
      registration.reset();
    } catch (error) {
      setStepError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formCol}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="NMU Alumni Association" />
          </Link>

          {registeredEmail ? <>
            <h1 className={styles.title}>{verified ? "Email verified" : "Check your email"}</h1>
            {verified ? <><p role="status" className={styles.subtitle}>{verifiedMessage}</p><Link to="/login" className={styles.link}>Continue to login</Link></> : <>
              <p className={styles.subtitle}>Enter the verification code sent to {registeredEmail}. The code expires after 15 minutes.</p>
              <form className={styles.form} onSubmit={async event => {
                event.preventDefault();
                if (otpRequestInFlight.current) return;
                otpRequestInFlight.current = true;
                setResendMessage("");
                resend.reset();
                try {
                  const result = await verification.mutateAsync({ email: registeredEmail, otp: otp.trim() });
                  if (/approval/i.test(result.message || "")) {
                    sessionStorage.removeItem("nmu_verification_email");
                    navigate("/pending-approval", { state: { email: registeredEmail, justVerified: true } });
                    return;
                  }
                  setVerifiedMessage(result.message || "Email verified. You can return to login.");
                  toast.success(result.message || "Email verified. You can return to login.");
                  sessionStorage.removeItem("nmu_verification_email");
                  setVerified(true); setOtp(""); verification.reset();
                } catch (error) { toast.error(error instanceof Error ? error.message : "Could not verify your email. Please try again."); }
                finally { otpRequestInFlight.current = false; }
              }}>
                <div className={styles.field}>
                  <label htmlFor="otp">Email verification code</label>
                  <div className={styles.inputWrap}><input id="otp" className={styles.noIconSelect} value={otp} onChange={event => setOtp(event.target.value)} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required disabled={verification.isPending} /></div>
                </div>
                <div className={styles.field}>
                  <button type="button" className={styles.resendBtn} onClick={handleResendOtp} disabled={resend.isPending || verification.isPending || resendSeconds > 0}>
                    {resend.isPending ? "Sending…" : resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
                  </button>
                  {resendMessage && <p className={styles.resendFeedback}>Use the latest code. It replaces the previous code and expires after 15 minutes.</p>}
                </div>
                <button type="submit" className={styles.nextBtn} disabled={verification.isPending || resend.isPending}>{verification.isPending ? "Verifying…" : "Verify email"}</button>
              </form>
            </>}
          </> : <>
          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>
            Join the NMU alumni and staff community.
          </p>

          {/* Stepper */}
          <ol className={styles.stepper}>
            {STEPS.map((label, i) => {
              const stepNum = i + 1;
              const isLast = stepNum === STEPS.length;
              const state =
                stepNum < step
                  ? styles.stepDone
                  : stepNum === step
                  ? styles.stepActive
                  : "";
              return (
                <li key={label} className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${state}`}>
                    {stepNum < step ? <Check size={15} /> : stepNum}
                  </div>
                  <span
                    className={`${styles.stepLabel} ${
                      isLast ? styles.stepLabelLast : ""
                    } ${state}`}
                  >
                    {label}
                  </span>
                  {stepNum < STEPS.length && (
                    <div
                      className={`${styles.stepLine} ${
                        stepNum < step ? styles.stepLineDone : ""
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="fullName">Full Name</label>
                  <div className={styles.inputWrap}>
                    <User size={17} className={styles.inputIcon} />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chidera Okonkwo"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={17} className={styles.inputIcon} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.inputWrap}>
                    <Lock size={17} className={styles.inputIcon} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.inputWrap}>
                    <Lock size={17} className={styles.inputIcon} />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="memberType">I am a</label>
                    <div className={styles.inputWrap}>
                      <GraduationCap size={17} className={styles.inputIcon} />
                      <select
                        id="memberType"
                        value={memberType}
                        onChange={(e) =>
                          setMemberType(e.target.value as "alumni" | "staff")
                        }
                      >
                        <option value="alumni">Alumnus / Alumna</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="graduationYear">
                      Graduation Year (alumni)
                    </label>
                    <div className={styles.inputWrap}>
                      <select
                        id="graduationYear"
                        disabled={memberType === "staff"}
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className={styles.noIconSelect}
                      >
                        {GRADUATION_YEARS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="discipline">Discipline / Programme</label>
                  <div className={styles.inputWrap}>
                    <select
                      id="discipline"
                      disabled={memberType === "staff"}
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className={styles.noIconSelect}
                    >
                      {DISCIPLINE_GROUPS.map((g) => (
                        <optgroup key={g.faculty} label={g.faculty}>
                          {g.programmes.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}


            <div className={styles.actions}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={goBack}
                  disabled={registration.isPending}
                >
                  <ChevronLeft size={18} strokeWidth={2.25} aria-hidden="true" /> Back
                </button>
              )}

              {step < STEPS.length ? (
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={goNext}
                >
                  Next <ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleCreateAccount}
                  disabled={registration.isPending}
                >
                  <UserPlus size={18} strokeWidth={2.25} aria-hidden="true" /> {registration.isPending ? "Creating account…" : "Create Account"}
                </button>
              )}
            </div>
          </form>
          </>}

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Log in
            </Link>
          </p>
        </div>
      </div>

      <AuthSidePanel />
    </div>
  );
};

export default Register;
