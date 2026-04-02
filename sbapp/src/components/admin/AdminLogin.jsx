import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    captchaInput: ""
  });
  const [captchaText, setCaptchaText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(text);
    drawCaptcha(text);
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0d0f1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(96,165,250,0.08)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 220, Math.random() * 60);
      ctx.lineTo(Math.random() * 220, Math.random() * 60);
      ctx.stroke();
    }

    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.textBaseline = "middle";
    const colors = ["#60a5fa", "#34d399", "#f9a8d4", "#fbbf24", "#a78bfa", "#fb923c"];
    for (let i = 0; i < text.length; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.save();
      ctx.translate(18 + i * 30, 30);
      ctx.rotate((Math.random() - 0.5) * 0.45);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,0.08)`;
      ctx.beginPath();
      ctx.arc(Math.random() * 220, Math.random() * 60, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (form.captchaInput !== captchaText) {
      setError("Wrong CAPTCHA. Please try again.");
      generateCaptcha();
      setForm(prev => ({ ...prev, captchaInput: "" }));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8086/admin/login", {
        username: form.username,
        password: form.password
      });

      if (res.data.role === "ADMIN") {
        localStorage.setItem("adminToken", "ADMIN_LOGGED_IN");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password.");
      generateCaptcha();
      setForm(prev => ({ ...prev, captchaInput: "" }));
    }
    setLoading(false);
  };

  return (
    <div className="al-page">
      <div className="al-blob al-blob1" />
      <div className="al-blob al-blob2" />
      <div className="al-blob al-blob3" />

      <div className="al-card">
        <div className="al-logo-row">
          <div className="al-logo-dot" />
          <span className="al-logo-text">Quick<em>Serve</em></span>
        </div>

        <div className="al-eyebrow">Admin Portal</div>
        <h2 className="al-title">Secure <em>Sign In</em></h2>
        <p className="al-subtitle">Access restricted to authorized personnel only.</p>

        <form onSubmit={handleLogin}>
          <div className="al-field">
            <label className="al-label">Username</label>
            <input
              className="al-input"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="al-field">
            <label className="al-label">Password</label>
            <input
              type="password"
              className="al-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="al-field">
            <label className="al-label">CAPTCHA Verification</label>
            <div className="al-captcha-row">
              <canvas ref={canvasRef} width={220} height={60} className="al-canvas" />
              <button type="button" className="al-refresh-btn" onClick={generateCaptcha} title="Refresh">
                🔄
              </button>
            </div>
            <input
              className="al-input al-captcha-input"
              placeholder="Type the characters above"
              value={form.captchaInput}
              onChange={e => setForm({ ...form, captchaInput: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="al-error">
              <span className="al-error-icon">⚠</span> {error}
            </div>
          )}

          <button type="submit" className={`al-btn ${loading ? "al-btn-loading" : ""}`} disabled={loading}>
            {loading ? <span className="al-spinner" /> : "Sign In to Admin Panel"}
          </button>
        </form>

        <p className="al-hint">Protected by QuickServe Security</p>
      </div>
    </div>
  );
}

export default AdminLogin;
