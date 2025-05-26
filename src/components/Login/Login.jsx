import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Firebase/AuthContext";
import { login } from "../Firebase/authService"; // your existing email/password login service
import { getIdTokenResult, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Firebase/firebase"; // <-- Import auth & googleProvider here
import bgImage from "../../assets/login-hero-bg.jpg";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, setIsAdmin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminMessage, setAdminMessage] = useState(false);

  useEffect(() => {
    if (currentUser) {
      checkAdmin(currentUser);
    }
  }, [currentUser]);

  const checkAdmin = async (user) => {
    try {
      const idTokenResult = await getIdTokenResult(user);
      const isAdmin = !!idTokenResult.claims.admin;

      if (setIsAdmin) {
        setIsAdmin(isAdmin);
      }

      if (isAdmin) {
        setAdminMessage(true);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error checking admin claim:", err);
      navigate("/home");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setAdminMessage(false);

    try {
      const userCredential = await login(email, password, rememberMe);
      await checkAdmin(userCredential.user);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Invalid email or password.");
    }
  };

  // New: Google Sign-in handler
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setAdminMessage(false);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await checkAdmin(user);
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg("Failed to login with Google.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        padding: "10px",
      }}
    >
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {errorMsg && <p className="error-message">{errorMsg}</p>}
          {adminMessage && (
            <div className="admin-message">
              Welcome, Admin! Redirecting to the home page...
            </div>
          )}
          <div className="input-field">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Enter your email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Enter your password</label>
          </div>
          <div className="forget">
            <label htmlFor="remember">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <p>Remember me</p>
            </label>
            <Link to="/forget-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          <button type="submit">Log In</button>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="google-login-button"
          >
            <img
              src="https://th.bing.com/th/id/OIP.Tz56zRxxoZT3t8_ULybhKgHaHa?w=167&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Google logo"
            />
            Continue with Google
          </button>

          <div className="register">
            <p>
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
