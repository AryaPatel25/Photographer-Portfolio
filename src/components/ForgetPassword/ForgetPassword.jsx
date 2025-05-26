import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/firebase"; // adjust path as needed
import "./ForgetPassword.css";
import bgImage from "../../assets/login-hero-bg.jpg"; // adjust path as needed

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter a valid email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset link sent to ${email}, if the account exists.`);
      setEmail("");
    } catch (err) {
      setError(
        "Failed to send reset link. Please check the email and try again."
      );
      console.error(err);
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
        <h2>Forget Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </div>

          <button type="submit">Send Reset Link</button>

          {message && (
            <p style={{ color: "lightgreen", marginTop: "20px" }}>{message}</p>
          )}
          {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
        </form>

        <div className="register">
          <p>
            Remembered your password? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
