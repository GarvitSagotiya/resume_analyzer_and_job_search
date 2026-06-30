import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure with a fallback empty object so it doesn't crash immediately
  const authContext = useAuth() || {};
  const { login } = authContext;

  const fromPath = location.state?.from?.pathname || "/dashboard";

  const cardRef = useRef(null);
  const formRef = useRef(null);
  const alertRef = useRef(null);

  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  // 1. Entrance animations for the login card and nested elements
  useEffect(() => {
    // 🛑 SAFETY CHECK: Abort if the DOM hasn't rendered yet
    if (!cardRef.current || !formRef.current) return; 

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.8, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power4.out" }
    );

    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.4, ease: "power3.out" }
    );
  }, []);

  // 2. Alert notification pop animation timeline lifecycle
  useEffect(() => {
    // 🛑 SAFETY CHECK: Check for alertRef.current as well!
    if (!alertInfo.visible || !alertRef.current) return;

    gsap.fromTo(
      alertRef.current,
      { autoAlpha: 0, y: -20, scale: 0.95 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
    );

    const timeoutId = setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
    }, 2600);

    return () => clearTimeout(timeoutId);
  }, [alertInfo.visible]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // SAFETY CHECK: Prevents the "login is not a function" crash
    if (typeof login !== 'function') {
      setAlertInfo({
        visible: true,
        type: "error",
        title: "Setup Error",
        message: "AuthContext is missing. Please wrap your app in <AuthProvider>.",
      });
      return;
    }

    try {
      await login(data.email, data.password);

      setAlertInfo({
        visible: true,
        type: "success",
        title: "Success!",
        message: "Login completed successfully. Redirecting...",
      });

      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 800);

    } catch (error) {
      console.error(error);
      setAlertInfo({
        visible: true,
        type: "error",
        title: "Login Failed",
        message: error.response?.data?.message || "Invalid email or password credentials.",
      });
    }
  };

  const onError = () => {
    setAlertInfo({
      visible: true,
      type: "error",
      title: "Validation Error",
      message: "Please double check your fields for completion correctness.",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div ref={cardRef} className="auth-card">
        <span className="auth-badge">AI Powered Career Toolkit</span>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to continue your journey and access resume insights, ATS recommendations, and top job matches.
        </p>

        {alertInfo.visible && (
          <div ref={alertRef} className={`auth-alert ${alertInfo.type}`}>
            <span>{alertInfo.type === "error" ? "⚠️" : "🎉"}</span>
            <div>
              <strong>{alertInfo.title}</strong>
              <div>{alertInfo.message}</div>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)} className="auth-form">
          {/* Email */}
          <div>
            <div className={`auth-input-group ${errors.email ? "input-error" : ""}`}>
              <span className="auth-input-icon"><FaEnvelope /></span>
              <input
                type="email"
                placeholder="Enter your email"
                className="auth-input"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && <p className="auth-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className={`auth-input-group ${errors.password ? "input-error" : ""}`}>
              <span className="auth-input-icon"><FaLock /></span>
              <input
                type="password"
                placeholder="Enter your password"
                className="auth-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
            </div>
            {errors.password && <p className="auth-error">{errors.password.message}</p>}
          </div>

          <div className="auth-meta">
            <label className="remember-check"><input type="checkbox" /> Remember me</label>
            <button type="button" className="auth-link-small">Forgot Password?</button>
          </div>

          <button type="submit" className="auth-submit-btn">Login</button>
          
          <p className="auth-switch-text">
            New here?{" "}
            <span className="auth-switch-link" onClick={() => navigate("/register")}>
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;