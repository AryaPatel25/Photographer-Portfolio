import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { AuthContext } from "../Firebase/AuthContext";
import Logo from "../../assets/Logo";
import "./Header.css";

const Header = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdmin } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          tabIndex={0}
          role="button"
          aria-label="Go to homepage"
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
        >
          <Logo />
        </div>

        {/* Mobile Menu Button (visible only on small screens) */}
        <button
          className="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <img
            src="/images/menu.png"  // Changed to menu.png from your public folder
            alt="Menu"
            className="menu-icon"
            draggable={false}
          />
        </button>

        {/* Navigation */}
        <nav
          className={`nav-container ${mobileMenuOpen ? "mobile-open" : ""}`}
          aria-label="Primary navigation"
        >
          <div className="nav-tabs">
            {navItems.map((item) => (
              <div
                key={item.name}
                role="link"
                tabIndex={0}
                className={`nav-item ${
                  location.pathname === item.path ? "nav-item-active" : ""
                }`}
                onClick={() => handleClick(item.path)}
                onKeyDown={(e) => e.key === "Enter" && handleClick(item.path)}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.name}
              </div>
            ))}

            {isAdmin && (
              <div
                role="link"
                tabIndex={0}
                className={`nav-item ${
                  location.pathname === "/admin-dashboard"
                    ? "nav-item-active"
                    : ""
                }`}
                onClick={() => handleClick("/admin-dashboard")}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleClick("/admin-dashboard")
                }
                aria-current={
                  location.pathname === "/admin-dashboard" ? "page" : undefined
                }
              >
                Dashboard
              </div>
            )}
          </div>

          <div className="action-buttons-container">
            <button
              className="contact-button"
              onClick={() => handleClick("/contact")}
              tabIndex={0}
            >
              Contact Me
            </button>

            {currentUser && (
              <button
                className="logout-button"
                onClick={handleLogout}
                aria-label="Logout"
                tabIndex={0}
              >
                <img
                  src="/images/logout.png"
                  alt="Logout"
                  className="logout-icon"
                  draggable={false}
                />
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
