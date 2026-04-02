import { useEffect, useState, useRef } from "react";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import "./Userbookings.css";

// ── Confetti helper ──────────────────────
const CONFETTI_COLORS = ["#e9a23b", "#34d399", "#818cf8", "#f9fafb", "#fcd34d"];

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: `${Math.random() * 0.8}s`,
    duration: `${1.8 + Math.random() * 1.2}s`,
  }));

  return (
    <div className="ub-confetti-wrap">
      {pieces.map(p => (
        <div
          key={p.id}
          className="ub-confetti-piece"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

// ── Countdown helper ─────────────────────
function Countdown({ dateStr }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return null;
  if (diff === 0) return (
    <div className="ub-countdown">
      <span className="ub-countdown-dot" />
      Your appointment is <b>Today!</b>
    </div>
  );
  if (diff === 1) return (
    <div className="ub-countdown">
      <span className="ub-countdown-dot" />
      Appointment <b>Tomorrow</b>
    </div>
  );
  return (
    <div className="ub-countdown">
      <span className="ub-countdown-dot" />
      Appointment in <b>{diff} days</b>
    </div>
  );
}

// ── Skeleton card ─────────────────────────
function SkeletonCard() {
  return (
    <div className="ub-skeleton-card">
      <div className="ub-skel-line lg" />
      <div className="ub-skel-line md" />
      <div style={{ display: "flex", gap: 10 }}>
        <div className="ub-skel-line sm" />
        <div className="ub-skel-line xs" />
      </div>
    </div>
  );
}

// ── Status helpers ────────────────────────
const getStep = (status) => {
  if (status === "PENDING")   return 1;
  if (status === "APPROVED")  return 2;
  if (status === "COMPLETED") return 3;
  if (status === "REJECTED")  return 0;
  return 0;
};

const getStatusClass = (s) => s?.toLowerCase() || "";

const getStatusLabel = (s) => {
  if (s === "PENDING")   return "Pending";
  if (s === "APPROVED")  return "Approved";
  if (s === "COMPLETED") return "Completed";
  if (s === "REJECTED")  return "Rejected";
  return s;
};

const FILTERS = ["All", "Pending", "Approved", "Completed", "Rejected"];

// ══════════════════════════════════════════
function UserBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const [sortDesc, setSortDesc]   = useState(true);
  const [copiedId, setCopiedId]   = useState(null);
  const pollRef                   = useRef(null);

  const userEmail = localStorage.getItem("userEmail");

  const fetchBookings = () => {
    axios
      .get(`http://localhost:8086/booking/user/${userEmail}`)
      .then(res => { setBookings(res.data); setLoading(false); });
  };

  useEffect(() => {
    fetchBookings();
    pollRef.current = setInterval(fetchBookings, 30000);
    return () => clearInterval(pollRef.current);
  }, []);

  const handleCopy = (email, id) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCancel = (bookingId) => {
    axios
      .delete(`http://localhost:8086/booking/cancel/${bookingId}`)
      .then(() => fetchBookings())
      .catch(err => console.log(err));
  };

  const handleRebook = (providerId) => {
    window.location.href = `/booking/${providerId}`;
  };

  const filtered = bookings
    .filter(b => filter === "All" || b.status === filter.toUpperCase())
    .sort((a, b) => {
      const da = new Date(a.bookingDate), db = new Date(b.bookingDate);
      return sortDesc ? db - da : da - db;
    });

  const countFor = (f) =>
    f === "All"
      ? bookings.length
      : bookings.filter(b => b.status === f.toUpperCase()).length;

  return (
    <div className="ub-page" style={{ paddingTop: "64px" }}>
      <UserNavbar />

      {/* ── Header ── */}
      <header className="ub-header">
        <div className="ub-header-top">
          <span className="ub-eyebrow">Booking History</span>
        </div>
        <div className="ub-title-row">
          <h2 className="ub-title">My <em>Bookings</em></h2>
          {bookings.length > 0 && (
            <div className="ub-count-badge">
              <span className="ub-count-num">{bookings.length}</span>
              <span className="ub-count-label">Total Orders</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Filter tabs ── */}
      {!loading && bookings.length > 0 && (
        <div className="ub-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`ub-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="ub-filter-count">{countFor(f)}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Sort row ── */}
      {!loading && filtered.length > 1 && (
        <div className="ub-sort-row">
          <span className="ub-sort-label">Sort</span>
          <button className="ub-sort-btn" onClick={() => setSortDesc(p => !p)}>
            {sortDesc ? "↓ Newest First" : "↑ Oldest First"}
          </button>
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

      {/* ── Empty state ── */}
      {!loading && bookings.length === 0 && (
        <div className="ub-empty">
          <div className="ub-empty-glyph">◈</div>
          <h3>No bookings yet</h3>
          <p>Your confirmed bookings will appear here.</p>
        </div>
      )}

      {/* ── Filter empty state ── */}
      {!loading && bookings.length > 0 && filtered.length === 0 && (
        <div className="ub-filter-empty">
          <p>No {filter.toLowerCase()} bookings found.</p>
        </div>
      )}

      {/* ── Cards ── */}
      {filtered.map((b, index) => {
        const step        = getStep(b.status);
        const statusClass = getStatusClass(b.status);
        const bookingRef  = `#QS-${String(b.id).padStart(5, "0")}`;

        const litPending   = step >= 1 ? "lit-pending"   : "";
        const litApproved  = step >= 2 ? "lit-approved"  : "";
        const litCompleted = step >= 3 ? "lit-completed" : "";

        return (
          <div
            key={b.id}
            className="ub-card"
            style={{ "--delay": `${index * 0.07}s` }}
          >
            {b.status === "COMPLETED" && <ConfettiBurst />}

            <div className={`ub-card-bar ${statusClass}`} />

            <div className="ub-progress-wrap">
              <div className="ub-progress-track">
                <div className={`ub-progress-fill ${statusClass}`} />
              </div>
              <div className="ub-progress-labels">
                <span className={`ub-progress-lbl ${litPending}`}>Requested</span>
                <span className={`ub-progress-lbl ${litApproved}`}>Approved</span>
                <span className={`ub-progress-lbl ${litCompleted}`}>Completed</span>
              </div>
            </div>

            <div className="ub-card-inner">

              {/* ── LEFT ── */}
              <div className="ub-card-info">
                <div className="ub-card-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="ub-provider-row">
                  <h4 className="ub-provider-name">{b.providerEmail}</h4>
                  <button
                    className={`ub-copy-btn ${copiedId === b.id ? "copied" : ""}`}
                    onClick={() => handleCopy(b.providerEmail, b.id)}
                  >
                    {copiedId === b.id ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <span className="ub-name-bar" />

                <div className="ub-booking-id">
                  Ref <span>{bookingRef}</span>
                </div>

                <div className="ub-meta-row">
                  <div className="ub-meta-pill">📅 <b>Date</b> {b.bookingDate}</div>
                  <div className="ub-meta-pill">⏰ <b>Slot</b> {b.bookingSlot}</div>
                  {b.serviceName && (
                    <div className="ub-meta-pill">🔧 <b>Service</b> {b.serviceName}</div>
                  )}
                </div>

                {b.status === "APPROVED" && b.bookingDate && (
                  <Countdown dateStr={b.bookingDate} />
                )}

                <div className="ub-actions">
                  {b.status === "PENDING" && (
                    <button
                      className="ub-btn-cancel"
                      onClick={() => handleCancel(b.id)}
                    >
                      ✕ Cancel Booking
                    </button>
                  )}
                  {b.status === "COMPLETED" && b.providerId && (
                    <button
                      className="ub-btn-rebook"
                      onClick={() => handleRebook(b.providerId)}
                    >
                      ↺ Book Again
                    </button>
                  )}
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div className="ub-card-right">

                <div className={`ub-status-badge ${statusClass}`}>
                  <span className="ub-status-dot" />
                  {getStatusLabel(b.status)}
                </div>

                <div className="ub-timeline">
                  <div className={`ub-step ${step >= 1 ? "done" : ""} ${step === 1 ? "active" : ""}`}>
                    <div className="ub-step-node">✓</div>
                    <span className="ub-step-label">Booking Requested</span>
                  </div>

                  <div className={`ub-step ${step >= 2 ? "done" : ""} ${step === 2 ? "active" : ""}`}>
                    <div className="ub-step-node">✓</div>
                    <span className="ub-step-label">Provider Approved</span>
                  </div>

                  <div className={`ub-step ${step >= 3 ? "done" : ""} ${step === 3 ? "active" : ""}`}>
                    <div className="ub-step-node">✓</div>
                    <span className="ub-step-label">Service Completed</span>
                  </div>

                  {b.status === "REJECTED" && (
                    <div className="ub-step rejected-step">
                      <div className="ub-step-node">✕</div>
                      <span className="ub-step-label">Booking Rejected</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default UserBookings;
