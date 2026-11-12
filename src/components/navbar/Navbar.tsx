import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import logo from '../../assets/images/svg/Asset 7@2x.png'
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import { Button } from "../ui/button/Button";
import { navLinks, moreLinks } from "../../constants/NavLinks";
import { useAuth } from "../../context/auth/useAuth";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav
      className={`${styles.navbar} ${
        scrolled || mobileMenuOpen || !isHome ? styles.scrolled : ""
      }`}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="" />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${styles.navLink} ${
                location.pathname === link.path ? styles.active : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className={styles.moreWrap} ref={moreRef}>
            <button
              type="button"
              className={`${styles.navLink} ${styles.moreToggle} ${
                moreLinks.some((l) => l.path === location.pathname)
                  ? styles.active
                  : ""
              }`}
              onClick={() => setMoreOpen((v) => !v)}
            >
              More <ChevronDown size={14} />
            </button>

            {moreOpen && (
              <div className={styles.moreDropdown}>
                {moreLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={styles.moreDropdownLink}
                    onClick={() => setMoreOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.profilePill}>
                <User size={15} />
                {user?.fullName.split(" ")[0]}
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut size={15} /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Join the Network</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className={styles.mobileDivider} />

          {moreLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className={styles.mobileActions}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    <User size={15} /> My Profile
                  </Button>
                </Link>
                <Button
                  className="w-full justify-center"
                  onClick={handleLogout}
                >
                  <LogOut size={15} /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    Join the Network
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
