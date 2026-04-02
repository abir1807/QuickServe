import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchProviders = () => {
    axios.get("http://localhost:8086/admin/providers")
      .then(res => setProviders(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleVerify = (email) => {
    axios.put(`http://localhost:8086/admin/verify/${email}`)
      .then(() => { alert("Provider Verified ✅"); fetchProviders(); })
      .catch(() => alert("Error verifying provider"));
  };

  const handleReject = (email) => {
    if (!window.confirm("Are you sure you want to reject & remove this provider?")) return;
    axios.delete(`http://localhost:8086/admin/reject/${email}`)
      .then(() => { alert("Provider Removed ❌"); fetchProviders(); })
      .catch(() => alert("Error removing provider"));
  };

  const filtered = providers
    .filter(p => {
      if (filter === "PENDING")  return !p.verified;
      if (filter === "VERIFIED") return  p.verified;
      return true;
    })
    .filter(p =>
      p.providerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase())
    );

  const count = (f) =>
    f === "ALL"      ? providers.length
    : f === "PENDING"  ? providers.filter(p => !p.verified).length
    : providers.filter(p => p.verified).length;

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Management</p>
            <h2 className="atb-title">Provider Verification</h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="atb-tabs">
          {["ALL", "PENDING", "VERIFIED"].map(f => (
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

        {/* Table */}
        <div className="atb-table-wrap">
          <table className="atb-table">
            <thead>
              <tr>
                {["Provider", "Email", "Mobile", "City", "Reg No", "Status", "Action"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.email} className="atb-tr">
                  <td className="atb-td">
                    <div className="atb-provider-cell">
                      <div className="atb-avatar">
                        {p.providerName?.[0]?.toUpperCase() || "P"}
                      </div>
                      <strong className="atb-name">{p.providerName}</strong>
                    </div>
                  </td>
                  <td className="atb-td atb-email">{p.email}</td>
                  <td className="atb-td">{p.mobile}</td>
                  <td className="atb-td">{p.city}</td>
                  <td className="atb-td">
                    <span className="atb-reg-no">{p.registrationNumber}</span>
                  </td>
                  <td className="atb-td">
                    <span className={`atb-badge ${p.verified ? "atb-badge-verified" : "atb-badge-pending"}`}>
                      {p.verified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </td>
                  <td className="atb-td">
                    <div className="atb-actions">
                      {!p.verified ? (
                        <>
                          <button className="atb-btn-verify" onClick={() => handleVerify(p.email)}>
                            Verify
                          </button>
                          <button className="atb-btn-reject" onClick={() => handleReject(p.email)}>
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="atb-btn-reject" onClick={() => handleReject(p.email)}>
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="atb-empty">
              <div className="atb-empty-icon">◈</div>
              <p>No providers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProviders;
