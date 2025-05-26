import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase"; // ✅ Adjust path as needed
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import bgImage from "../../assets/login-hero-bg.jpg";
import "../Login/Login.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.displayName && user.email) {
        await updateProfile(user, {
          displayName: user.email.split("@")[0],
        });
      }
      navigate("/home");
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error);
    }
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !confirmPassword) {
      return "All fields are required.";
    }
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { name, email, password } = formData;

      // ✅ Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Set display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Signup successful:", userCredential.user);
      navigate("/"); // redirect to login or homepage
    } catch (err) {
      console.error(err);
      setError(err.message);
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
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          <div className="input-field">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label>Enter your name</label>
          </div>

          <div className="input-field">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label>Enter your email</label>
          </div>

          <div className="input-field">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Enter your password</label>
          </div>

          <div className="input-field">
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label>Confirm your password</label>
          </div>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button type="submit">Sign Up</button>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://th.bing.com/th/id/OIP.Tz56zRxxoZT3t8_ULybhKgHaHa?w=167&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="Google logo"
            />
            Sign up with Google
          </button>
          <div className="register">
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
