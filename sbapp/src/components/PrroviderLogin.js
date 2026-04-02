import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import gsap from "gsap";
import "./PrroviderLogin.css";

function PrroviderLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* REFS */
  const cardRef    = useRef();
  const avatarRef  = useRef();
  const inputRefs  = useRef([]);
  const buttonRef  = useRef();
  const socialRefs = useRef([]);
  const cursorRef  = useRef();

  /* PREMIUM CURSOR FOLLOWER */
  useEffect(() => {

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX - 9,
        y: e.clientY - 9,
        duration: 0.3,
        ease: "power3.out"
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);

  }, []);

  /* PAGE LOAD ANIMATION */
  useEffect(() => {

    const tl = gsap.timeline();

    tl.from(cardRef.current, {
      y: 80,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power4.out"
    })

    .from(avatarRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.5")

    .from(inputRefs.current, {
      x: -40,
      opacity: 0,
      stagger: 0.2,
      duration: 0.6
    }, "-=0.3")

    .from(buttonRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6
    }, "-=0.2")

    .from(socialRefs.current, {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.5
    }, "-=0.3");

    /* FLOATING AVATAR LOOP */
    gsap.to(avatarRef.current, {
      y: -8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, []);
const handleLogin = async () => {

  // ✅ Validate empty fields
  if (!email.trim()) {
    alert("Please enter your email");
    return;
  }
  if (!password.trim()) {
    alert("Please enter your password");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8086/provider/login",
      { email, password }
    );

    const provider = response.data;

    // ✅ Check if admin has verified this provider
    if (!provider.verified) {
      alert("Your account is pending admin verification.\nPlease wait for approval.");
      return;
    }

    localStorage.setItem("provider", JSON.stringify(provider));
    localStorage.setItem("providerEmail", provider.email);

    navigate("/servicedashboard");

  } catch(err) {
    console.log(err);
    if (err.response?.status === 401) {
      alert("Wrong password. Please try again.");
    } else if (err.response?.status === 404) {
      alert("Provider not found. Please check your email.");
    } else {
      alert("Login failed. Please try again.");
    }
  }

};
  const handleSignup = () => {
    navigate("/ServiceRegister");
  };

  /* MAGNETIC BUTTON EFFECT */
  const magnetic = (e) => {

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(e.currentTarget, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3
    });

  };

  const magneticLeave = (e) => {

    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.3
    });

  };

  return (

    <div className="pl-container">

      {/* PREMIUM CURSOR */}
      <div ref={cursorRef} className="pl-cursor" />

      <div ref={cardRef} className="pl-card">

        {/* Avatar */}
        <div ref={avatarRef} className="pl-avatar">
          👤
        </div>

        {/* Eyebrow */}
        <div className="pl-eyebrow">Provider Portal</div>

        {/* Title */}
        <h2 className="pl-title">
          Welcome <em>back</em>
        </h2>

        <p className="pl-subtitle">
          Sign in to your provider account to continue.
        </p>

        {/* Email input */}
        <div
          className="pl-input-wrap"
          ref={el => inputRefs.current[0] = el}
        >
          <label className="pl-input-label">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-input"
          />
        </div>

        {/* Password input */}
        <div
          className="pl-input-wrap"
          ref={el => inputRefs.current[1] = el}
        >
          <label className="pl-input-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-input"
          />
        </div>

        {/* Sign In button */}
        <button
          ref={buttonRef}
          onClick={handleLogin}
          onMouseMove={magnetic}
          onMouseLeave={magneticLeave}
          className="pl-btn-primary"
        >
          <span>Sign In</span>
        </button>

        {/* Divider */}
        <div className="pl-divider">
          <span>or continue with</span>
        </div>

        {/* Social buttons */}
        <div className="pl-social-row">

          <button
            ref={el => socialRefs.current[0] = el}
            className="pl-social-btn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              className="pl-social-icon"
              alt="Google"
            />
          </button>

          <button
            ref={el => socialRefs.current[1] = el}
            className="pl-social-btn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              className="pl-social-icon"
              alt="GitHub"
              style={{ filter: "invert(1)" }}
            />
          </button>

          <button
            ref={el => socialRefs.current[2] = el}
            className="pl-social-btn"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
              className="pl-social-icon"
              alt="Facebook"
            />
          </button>

        </div>

        {/* Signup row */}
        <div className="pl-signup-row">
          <span className="pl-signup-text">Don't have an account?</span>
          <button onClick={handleSignup} className="pl-signup-btn">
            Sign up
          </button>
        </div>

      </div>

    </div>

  );
}

export default PrroviderLogin;