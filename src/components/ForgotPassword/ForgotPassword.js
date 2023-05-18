import { auth } from "../../firebase";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import InputControl from "../InputControl/InputControl";

import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage(
          "A password reset email has been sent to your email address. Please check your inbox and follow the instructions to reset your password."
        );
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        {/* Display the image */}
        <img
          src="https://admissionsinchennai.in/admissions/wp-content/uploads/2016/10/Amrita-University-Logo-263x300.png"
          alt="Logo"
          className={styles.logo}
        />

        <h1 className={styles.heading}>Forgot Password</h1>
        {message && <div className={styles.message}>{message}</div>}
        <form onSubmit={handleResetPassword}>
          <InputControl
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          <button type="submit" disabled={loading} className={styles.loginButton}>
            Reset Password
          </button>

        </form>
        <div className={styles.footer}>
          <p>
            Remember your password?{" "}
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
