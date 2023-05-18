import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import InputControl from "../InputControl/InputControl";
import { auth } from "../../firebase";

import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.email || !values.password) {
      setErrorMsg("Fill in all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((res) => {
        setSubmitButtonDisabled(false);
        navigate("/calendar"); // Navigate to the calendar page after successful login
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    setSubmitButtonDisabled(true);
    signInWithPopup(auth, provider)
      .then((res) => {
        setSubmitButtonDisabled(false);
        navigate("/calendar"); // Navigate to the calendar page after successful login
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const logoImage = "https://admissionsinchennai.in/admissions/wp-content/uploads/2016/10/Amrita-University-Logo-263x300.png";

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <img className={styles.logo} src={logoImage} alt="Logo" />
        
        <h1 className={styles.heading}>Login</h1>

        <InputControl
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          placeholder="Enter email address"
        />
        <InputControl
          label="Password"
          type="password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          placeholder="Enter password"
        />

        <div className={styles.footer}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
         
          <button disabled={submitButtonDisabled} onClick={handleSubmission}>
            Login
          </button>
          <p>
            Forgot your password?{" "}
            <span>
              <Link to="/forgot-password">Reset it</Link>
            </span>
          </p>
          <p>
            Don't have an account?{" "}
            <span>
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
          <p>
            <span>
              <button disabled={submitButtonDisabled} onClick={handleGoogleSignIn}>
                Sign in with Google
              </button>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
