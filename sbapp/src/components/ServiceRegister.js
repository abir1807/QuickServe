import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ServiceRegister.css";

function ServiceRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [registration, setRegistration] = useState({
    providerName: "",
    mobile: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistration(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setRegistration(prev => ({ ...prev, pincode: value, city: "", state: "" }));
    setErrors(prev => ({ ...prev, pincode: "" }));

    if (value.length === 6 && /^[0-9]{6}$/.test(value)) {
      setPincodeLoading(true);
      try {
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = res.data[0];
        if (data.Status === "Success") {
          const postOffice = data.PostOffice[0];
          setRegistration(prev => ({
            ...prev,
            pincode: value,
            city:  postOffice.District,
            state: postOffice.State
          }));
          setErrors(prev => ({ ...prev, city: "", state: "", pincode: "" }));
        } else {
          setErrors(prev => ({ ...prev, pincode: "Invalid pincode" }));
        }
      } catch (err) {
        console.log("Pincode fetch failed:", err);
      }
      setPincodeLoading(false);
    }
  };

  const validateStep1 = () => {
    const e = {};
    if (!registration.providerName.trim()) e.providerName = "Name is required";
    if (!registration.email.trim())        e.email        = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)) e.email = "Invalid email";
    if (!registration.mobile.trim())       e.mobile       = "Mobile is required";
    if (!/^[0-9]{10}$/.test(registration.mobile))               e.mobile = "Must be 10 digits";
    if (!registration.password.trim())     e.password     = "Password is required";
    if (registration.password.length < 6) e.password     = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!registration.address.trim()) e.address = "Address is required";
    if (!registration.city.trim())    e.city    = "City is required";
    if (!registration.state.trim())   e.state   = "State is required";
    if (!registration.pincode.trim()) e.pincode = "Pincode is required";
    if (!/^[0-9]{6}$/.test(registration.pincode)) e.pincode = "Must be 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (!agreed) { alert("Please confirm the information is correct"); return; }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:8086/addr", registration);
      navigate("/registrationsuccessful", {
        state: { email: registration.email, password: registration.password }
      });
    } catch (error) {
      alert("Error saving registration");
      setSubmitting(false);
    }
  };

  const isAutoFilled = (field) =>
    registration[field] && registration.pincode.length === 6;

  const steps = ["Provider Details", "Location", "Confirm"];

  return (
    <div className="sr-page">
      <div className="sr-orb sr-orb1" />
      <div className="sr-orb sr-orb2" />

      <div className="sr-wrapper">

        <div className="sr-left">
          <Link to="/Home" className="sr-back">← Back to Home</Link>

          <div className="sr-brand">
            <div className="sr-brand-dot" />
            <span className="sr-brand-name">Quick<em>Serve</em></span>
          </div>

          <h1 className="sr-hero-title">
            Join as a<br /><em>Provider</em>
          </h1>

          <p className="sr-hero-sub">
            List your services, reach thousands of customers, and grow your business on QuickServe.
          </p>

          <div className="sr-perks">
            {[
              { icon: "✦", text: "Verified provider badge" },
              { icon: "✦", text: "Real-time booking management" },
              { icon: "✦", text: "Direct customer reach" },
              { icon: "✦", text: "Email confirmation & support" },
            ].map((p, i) => (
              <div key={i} className="sr-perk">
                <span className="sr-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>

          <div className="sr-already">
            Already registered?{" "}
            <Link to="/PrroviderLogin" className="sr-login-link">Sign In</Link>
          </div>
        </div>

        <div className="sr-right">
          <div className="sr-card">

            <div className="sr-steps">
              {steps.map((s, i) => (
                <div key={i} className={`sr-step ${step === i + 1 ? "sr-step-active" : step > i + 1 ? "sr-step-done" : ""}`}>
                  <div className="sr-step-circle">
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="sr-step-label">{s}</span>
                  {i < steps.length - 1 && <div className="sr-step-line" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              {step === 1 && (
                <div className="sr-form-section">
                  <p className="sr-section-eyebrow">Step 01</p>
                  <h3 className="sr-section-title">Provider <em>Details</em></h3>

                  <div className="sr-grid-2">
                    <div className="sr-field">
                      <label className="sr-label">Full Name</label>
                      <input
                        className={`sr-input ${errors.providerName ? "sr-input-err" : ""}`}
                        placeholder="John Doe"
                        name="providerName"
                        value={registration.providerName}
                        onChange={handleInputChange}
                      />
                      {errors.providerName && <span className="sr-err">{errors.providerName}</span>}
                    </div>

                    <div className="sr-field">
                      <label className="sr-label">Email Address</label>
                      <input
                        type="email"
                        className={`sr-input ${errors.email ? "sr-input-err" : ""}`}
                        placeholder="you@example.com"
                        name="email"
                        value={registration.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <span className="sr-err">{errors.email}</span>}
                    </div>

                    <div className="sr-field">
                      <label className="sr-label">Mobile Number</label>
                      <input
                        className={`sr-input ${errors.mobile ? "sr-input-err" : ""}`}
                        placeholder="10-digit mobile"
                        name="mobile"
                        value={registration.mobile}
                        onChange={handleInputChange}
                        maxLength={10}
                      />
                      {errors.mobile && <span className="sr-err">{errors.mobile}</span>}
                    </div>

                    <div className="sr-field">
                      <label className="sr-label">Password</label>
                      <input
                        type="password"
                        className={`sr-input ${errors.password ? "sr-input-err" : ""}`}
                        placeholder="Min 6 characters"
                        name="password"
                        value={registration.password}
                        onChange={handleInputChange}
                      />
                      {errors.password && <span className="sr-err">{errors.password}</span>}
                    </div>
                  </div>

                  <button type="button" className="sr-next-btn" onClick={handleNext}>
                    Continue <span>→</span>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="sr-form-section">
                  <p className="sr-section-eyebrow">Step 02</p>
                  <h3 className="sr-section-title">Location <em>Details</em></h3>

                  <div className="sr-field" style={{ marginBottom: 20 }}>
                    <label className="sr-label">Full Address</label>
                    <input
                      className={`sr-input ${errors.address ? "sr-input-err" : ""}`}
                      placeholder="House no, street, area"
                      name="address"
                      value={registration.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && <span className="sr-err">{errors.address}</span>}
                  </div>

                  <div className="sr-grid-3">

                    <div className="sr-field">
                      <label className="sr-label">
                        Pincode
                        {pincodeLoading && (
                          <span className="sr-pin-loading">fetching…</span>
                        )}
                      </label>
                      <input
                        className={`sr-input ${errors.pincode ? "sr-input-err" : ""}`}
                        placeholder="6-digit"
                        name="pincode"
                        value={registration.pincode}
                        onChange={handlePincodeChange}
                        maxLength={6}
                      />
                      {errors.pincode && <span className="sr-err">{errors.pincode}</span>}
                    </div>

                    <div className="sr-field">
                      <label className="sr-label">
                        City
                        {isAutoFilled("city") && (
                          <span className="sr-autofill-tag">✦ auto</span>
                        )}
                      </label>
                      <input
                        className="sr-input"
                        placeholder="City"
                        name="city"
                        value={registration.city}
                        onChange={handleInputChange}
                        style={isAutoFilled("city")
                          ? { borderColor: "rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.04)" }
                          : {}
                        }
                      />
                      {errors.city && <span className="sr-err">{errors.city}</span>}
                    </div>

                    <div className="sr-field">
                      <label className="sr-label">
                        State
                        {isAutoFilled("state") && (
                          <span className="sr-autofill-tag">✦ auto</span>
                        )}
                      </label>
                      <input
                        className="sr-input"
                        placeholder="State"
                        name="state"
                        value={registration.state}
                        onChange={handleInputChange}
                        style={isAutoFilled("state")
                          ? { borderColor: "rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.04)" }
                          : {}
                        }
                      />
                      {errors.state && <span className="sr-err">{errors.state}</span>}
                    </div>

                  </div>

                  <div className="sr-checkbox-wrap">
                    <input
                      type="checkbox"
                      id="agree"
                      className="sr-checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                    />
                    <label htmlFor="agree" className="sr-checkbox-label">
                      I confirm that all the above information is accurate and correct.
                    </label>
                  </div>

                  <div className="sr-btn-row">
                    <button type="button" className="sr-back-btn" onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className={`sr-submit-btn ${submitting ? "sr-btn-loading" : ""}`}
                      disabled={submitting}
                    >
                      {submitting
                        ? <span className="sr-spinner" />
                        : <>Register Now <span>→</span></>
                      }
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ServiceRegister;
