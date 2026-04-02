import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("ALL");

  useEffect(() => {
    const provider = JSON.parse(localStorage.getItem("provider"));
    if (provider) {
      axios.get(`http://localhost:8086/booking/provider/${provider.email}`)
        .then(res => { setBookings(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:8086/booking/status/${id}/${status}`)
      .then(() => {
        setBookings(prev =>
          prev.map(b => b.id === id ? { ...b, status } : b)
        );
      })
      .catch(() => alert("Action failed"));
  };

  const statusMeta = (s) => {
    if (s === "APPROVED")  return { cls: "mb-badge-approved",  label: "Approved"  };
    if (s === "REJECTED")  return { cls: "mb-badge-rejected",  label: "Rejected"  };
    if (s === "COMPLETED") return { cls: "mb-badge-completed", label: "Completed" };
    return                        { cls: "mb-badge-pending",   label: "Pending"   };
  };

  const FILTERS = ["ALL","PENDING","APPROVED","COMPLETED","REJECTED"];

  const count = (f) =>
    f === "ALL" ? bookings.length : bookings.filter(b => b.status === f).length;

  const filtered = bookings.filter(b =>
    filter === "ALL" || b.status === filter
  );

  return (
    <div className="mb-layout">
      <Sidebar />

      <div className="mb-main">

        <div className="mb-topbar">
          <div>
            <p className="mb-eyebrow">Provider Portal</p>
            <h2 className="mb-title">My <em>Bookings</em></h2>
          </div>
          <div className="mb-total-badge">
            <span className="mb-total-num">{bookings.length}</span>
            <span className="mb-total-label">Total</span>
          </div>
        </div>

        {/* Filter Tabs */}
        {!loading && bookings.length > 0 && (
          <div className="mb-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`mb-filter-btn ${filter === f ? "mb-filter-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="mb-filter-count">{count(f)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-loading">
            <div className="mb-ring" />
            <p>Loading bookings…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 && (
          <div className="mb-empty">
            <div className="mb-empty-icon">◈</div>
            <h3>No Bookings Yet</h3>
            <p>Bookings from users will appear here once they start booking your services.</p>
          </div>
        )}

        {/* Filter empty */}
        {!loading && bookings.length > 0 && filtered.length === 0 && (
          <div className="mb-empty">
            <div className="mb-empty-icon">◇</div>
            <p>No {filter.toLowerCase()} bookings found.</p>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="mb-table-wrap">
            <table className="mb-table">
              <thead>
                <tr>
                  {["#","User","Date","Slot","Address","Status","Action"].map(h => (
                    <th key={h} className="mb-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const meta = statusMeta(b.status);
                  return (
                    <tr key={b.id} className="mb-tr">
                      <td className="mb-td mb-td-num">{i + 1}</td>
                      <td className="mb-td">
                        <div className="mb-user-cell">
                          <div className="mb-user-avatar">
                            {b.userEmail?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="mb-user-email">{b.userEmail}</span>
                        </div>
                      </td>
                      <td className="mb-td">{b.bookingDate}</td>
                      <td className="mb-td">
                        <span className="mb-slot">{b.bookingSlot}</span>
                      </td>
                      <td className="mb-td mb-td-addr">{b.address}</td>
                      <td className="mb-td">
                        <span className={`mb-badge ${meta.cls}`}>{meta.label}</span>
                      </td>
                      <td className="mb-td">
                        {b.status === "PENDING" && (
                          <div className="mb-action-row">
                            <button
                              className="mb-btn-approve"
                              onClick={() => updateStatus(b.id, "APPROVED")}
                            >
                              Approve
                            </button>
                            <button
                              className="mb-btn-reject"
                              onClick={() => updateStatus(b.id, "REJECTED")}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {b.status === "APPROVED" && (
                          <button
                            className="mb-btn-complete"
                            onClick={() => updateStatus(b.id, "COMPLETED")}
                          >
                            ✦ Mark Complete
                          </button>
                        )}
                        {b.status === "COMPLETED" && (
                          <span className="mb-done-text">✔ Done</span>
                        )}
                        {b.status === "REJECTED" && (
                          <span className="mb-rejected-text">✕ Rejected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;
