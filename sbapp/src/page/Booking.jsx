import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./BookingPage.css";

function BookingPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider]         = useState(null);
  const [slots, setSlots]               = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [date, setDate]                 = useState("");
  const [address, setAddress]           = useState("");
  const [note, setNote]                 = useState("");
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/provider/serviceDetails/${providerId}`)
      .then(res => {
        setProvider(res.data);
        generateSlots(res.data.workingStart, res.data.workingEnd);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [providerId]);

  const generateSlots = (start, end) => {
    const startHour = parseInt(start.split(":")[0]);
    const endHour   = parseInt(end.split(":")[0]);
    const temp = [];
    for (let i = startHour; i < endHour; i++) {
      const from = `${String(i).padStart(2,"0")}:00`;
      const to   = `${String(i+1).padStart(2,"0")}:00`;
      temp.push(`${from} – ${to}`);
    }
    setSlots(temp);
  };

  const today = new Date().toISOString().split("T")[0];

  const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  // ✅ Timezone-safe working day check
  const isWorkingDay = (dateStr) => {
    if (!provider?.workingDays) return true;
    const dayName = DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
    return provider.workingDays.split(",").map(d => d.trim()).includes(dayName);
  };

  // ✅ Date change with working day validation
  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (!isWorkingDay(selected)) {
      const dayName = DAY_NAMES[new Date(selected + "T00:00:00").getDay()];
      alert(`Provider is not available on ${dayName}s.\nAvailable days: ${provider.workingDays}`);
      setDate("");
      return;
    }
    setDate(selected);
  };

  const handleBooking = async () => {
    if (!date)         return shake("bp-date-wrap");
    if (!selectedSlot) return shake("bp-slots-wrap");
    if (!address)      return shake("bp-address-wrap");

    const booking = {
      serviceDetailsId: provider.id,
      providerEmail:    provider.providerEmail,
      userEmail:        localStorage.getItem("userEmail"),
      bookingDate:      date,
      bookingSlot:      selectedSlot,
      address,
      note,
      status: "PENDING"
    };

    setSubmitting(true);
    try {
      await axios.post("http://localhost:8086/booking/create", booking);
      setSuccess(true);
      setTimeout(() => navigate("/UserBooking"), 2200);
    } catch {
      setSubmitting(false);
      alert("Booking Failed ❌");
    }
  };

  const shake = (cls) => {
    const el = document.querySelector(`.${cls}`);
    if (!el) return;
    el.classList.add("bp-shake");
    setTimeout(() => el.classList.remove("bp-shake"), 500);
  };

  if (loading) return (
    <div className="bp-page">
      <div className="bp-loader">
        <div className="bp-loader-ring" />
        <p>Loading provider details…</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="bp-page">
      <div className="bp-success-screen">
        <div className="bp-success-circle">
          <svg viewBox="0 0 52 52" className="bp-check-svg">
            <circle className="bp-check-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="bp-check-path" fill="none" d="M14 27l8 8 16-16"/>
          </svg>
        </div>
        <h2 className="bp-success-title">Booking Requested!</h2>
        <p className="bp-success-sub">Redirecting to your bookings…</p>
      </div>
    </div>
  );

  const workingDays = provider?.workingDays
    ? provider.workingDays.split(",").map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <div className="bp-page">
      <div className="bp-orb bp-orb1" />
      <div className="bp-orb bp-orb2" />

      <button className="bp-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="bp-layout">

        <aside className="bp-aside">
          <div className="bp-aside-inner">
            <p className="bp-aside-eyebrow">You're booking</p>

            <div className="bp-provider-avatar">
              {provider?.providerEmail?.[0]?.toUpperCase() || "P"}
            </div>

            <h3 className="bp-provider-name">{provider?.providerEmail}</h3>
            <div className="bp-divider-line" />

            <div className="bp-info-grid">

              <div className="bp-info-item">
                <span className="bp-info-icon">📍</span>
                <div>
                  <div className="bp-info-label">Location</div>
                  <div className="bp-info-val">{provider?.location || "—"}</div>
                </div>
              </div>

              <div className="bp-info-item">
                <span className="bp-info-icon">📅</span>
                <div>
                  <div className="bp-info-label">Working Days</div>
                  <div className="bp-info-val">
                    {workingDays.length > 0
                      ? workingDays.map((day, i) => (
                          <span key={i} className="bp-day-pill">{day}</span>
                        ))
                      : "—"
                    }
                  </div>
                </div>
              </div>

              <div className="bp-info-item">
                <span className="bp-info-icon">⏰</span>
                <div>
                  <div className="bp-info-label">Hours</div>
                  <div className="bp-info-val">
                    {provider?.workingStart} – {provider?.workingEnd}
                  </div>
                </div>
              </div>

            </div>

            <div className="bp-price-box">
              <span className="bp-price-label">Service Charge</span>
              <span className="bp-price-val">₹{provider?.serviceCharge}</span>
              <span className="bp-price-unit">/ visit</span>
            </div>

            {(provider?.image1 || provider?.image2) && (
              <div className="bp-images">
                {provider.image1 && (
                  <img src={`/assets/services/${provider.image1}`} className="bp-img" alt="s1" />
                )}
                {provider.image2 && (
                  <img src={`/assets/services/${provider.image2}`} className="bp-img" alt="s2" />
                )}
              </div>
            )}
          </div>
        </aside>

        <main className="bp-main">
          <p className="bp-form-eyebrow">Step by step</p>
          <h2 className="bp-form-title">Confirm <em>Booking</em></h2>

          <div className="bp-field bp-date-wrap">
            <label className="bp-label">
              <span className="bp-step-num">01</span> Select Date
            </label>
            <input
              type="date"
              className="bp-input"
              min={today}
              value={date}
              onChange={handleDateChange}
            />
            {workingDays.length > 0 && (
              <p className="bp-available-days">
                Available on: <span>{workingDays.join(" · ")}</span>
              </p>
            )}
          </div>

          <div className="bp-field bp-slots-wrap">
            <label className="bp-label">
              <span className="bp-step-num">02</span> Pick a Time Slot
            </label>
            {slots.length === 0 ? (
              <p className="bp-no-slots">No slots available</p>
            ) : (
              <div className="bp-slots-grid">
                {slots.map((s, i) => (
                  <button
                    key={i}
                    className={`bp-slot ${selectedSlot === s ? "bp-slot-active" : ""}`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bp-field bp-address-wrap">
            <label className="bp-label">
              <span className="bp-step-num">03</span> Your Address
            </label>
            <textarea
              className="bp-textarea"
              placeholder="Enter your full address where service is needed…"
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="bp-field">
            <label className="bp-label">
              <span className="bp-step-num">04</span> Additional Note
              <span className="bp-optional">(optional)</span>
            </label>
            <textarea
              className="bp-textarea"
              placeholder="Any special instructions or requests…"
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {(date || selectedSlot) && (
            <div className="bp-summary">
              <p className="bp-summary-title">Booking Summary</p>
              <div className="bp-summary-row">
                <span>Date</span>
                <span>{date || "—"}</span>
              </div>
              <div className="bp-summary-row">
                <span>Slot</span>
                <span>{selectedSlot || "—"}</span>
              </div>
              <div className="bp-summary-row bp-summary-total">
                <span>Total</span>
                <span>₹{provider?.serviceCharge}</span>
              </div>
            </div>
          )}

          <button
            className={`bp-confirm-btn ${submitting ? "bp-btn-loading" : ""}`}
            onClick={handleBooking}
            disabled={submitting}
          >
            {submitting
              ? <span className="bp-spinner" />
              : <>Confirm Booking <span className="bp-btn-arrow">→</span></>
            }
          </button>
        </main>

      </div>
    </div>
  );
}

export default BookingPage;
