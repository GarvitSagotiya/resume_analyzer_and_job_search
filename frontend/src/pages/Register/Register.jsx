import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

import {
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const formRef = useRef(null);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 🛑 SAFETY CHECK: Abort if the DOM hasn't rendered yet
    if (!cardRef.current || !formRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 60,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      }
    );

    gsap.fromTo(
      formRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      }
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Submitting registration data:", data);

      const response = await axios.post(
        "http://localhost:7300/api/users/register",
        data
      );

      console.log("SERVER RESPONSE:", response.data);

      if (response.data) {
        setSuccess(true);

        // Smooth bounce delay to allow success banner completion
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      
      // Show the actual error message returned from your backend (e.g., "User already exists")
      alert(error.response?.data?.message || "Server Error occurred during registration.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div ref={cardRef} className="auth-card">
        <span className="auth-badge">
          AI Powered Career Toolkit
        </span>

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join Resume Analyzer and unlock AI-powered
          resume analysis and job recommendations.
        </p>

        {success && (
          <div className="auth-alert success" style={{ backgroundColor: '#10B981', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
            🎉 Registration successful! Redirecting to login...
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="auth-form"
        >
          {/* Name */}
          <div>
            <div
              className={`auth-input-group ${
                errors.name ? "input-error" : ""
              }`}
            >
              <span className="auth-input-icon">
                <FaUser />
              </span>

              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </div>

            {errors.name && (
              <p className="auth-error">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <div
              className={`auth-input-group ${
                errors.email ? "input-error" : ""
              }`}
            >
              <span className="auth-input-icon">
                <FaEnvelope />
              </span>

              <input
                type="email"
                placeholder="Email Address"
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

            {errors.email && (
              <p className="auth-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              className={`auth-input-group ${
                errors.password ? "input-error" : ""
              }`}
            >
              <span className="auth-input-icon">
                <FaLock />
              </span>

              <input
                type="password"
                placeholder="Create Password"
                className="auth-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Password must be at least 6 characters",
                  },
                })}
              />
            </div>

            {errors.password && (
              <p className="auth-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Create Account
          </button>

          <p className="auth-switch-text">
            Already have an account?{" "}
            <span
              className="auth-switch-link"
              onClick={() => navigate("/login")}
              style={{ cursor: 'pointer', color: '#3B82F6', textDecoration: 'underline' }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;