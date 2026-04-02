import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8086/admin/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  }, []);

  const statusMeta = (s) => {
    if (s === "APPROVED")  return { cls: "atb-badge-verified",  label: "Approved"  };
    if (s === "REJECTED")  return { cls: "atb-badge-rejected",  label: "Rejected"  };
    if (s === "COMPLETED") return { cls: "atb-badge-completed", label: "Completed" };
    return                        { cls: "atb-badge-pending",   label: "Pending"   };
  };

  const filtered = bookings
    .filter(b => filter === "ALL" || b.status === filter)
    .filter(b =>
      b.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      b.providerEmail?.toLowerCase().includes(search.toLowerCase())
    );

  const count = (f) =>
    f === "ALL" ? bookings.length : bookings.filter(b => b.status === f).length;

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Overview</p>
            <h2 className="atb-title">All Bookings <span className="atb-count-pill">{bookings.length}</span></h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search by user or provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="atb-tabs">
          {["ALL", "PENDING", "APPROVED", "COMPLETED", "REJECTED"].map(f => (
            <button
              key={f}
              className={`atb-tab ${filter === f ? "atb-tab-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="atb-tab-count">{count(f)}</span>
            </button>
          ))}
        </div>

        <div className="atb-table-wrap">
          <table className="atb-table">
            <thead>
              <tr>
                {["#", "User", "Provider", "Date", "Slot", "Address", "Status"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const meta = statusMeta(b.status);
                return (
                  <tr key={b.id} className="atb-tr">
                    <td className="atb-td atb-num">{i + 1}</td>
                    <td className="atb-td atb-email">{b.userEmail}</td>
                    <td className="atb-td atb-email">{b.providerEmail}</td>
                    <td className="atb-td">{b.bookingDate}</td>
                    <td className="atb-td">{b.bookingSlot}</td>
                    <td className="atb-td">{b.address}</td>
                    <td className="atb-td">
                      <span className={`atb-badge ${meta.cls}`}>{meta.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="atb-empty">
              <div className="atb-empty-icon">◈</div>
              <p>No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
