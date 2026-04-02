import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminServiceTypes() {
  const [services,    setServices]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [search,      setSearch]      = useState("");
  const [editing,     setEditing]     = useState(false);
  const [form, setForm] = useState({
    serviceId: "", serviceName: "", serviceType: "", cid: ""
  });

  const fetchServices = () => {
    axios.get("http://localhost:8086/fetchs")
      .then(res => setServices(res.data))
      .catch(err => console.log(err));
  };

  const fetchCategories = () => {
    axios.get("http://localhost:8086/api/fetch")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.serviceName || !form.cid) {
      alert("Please fill all required fields");
      return;
    }
    try {
      if (editing) {
        await axios.put("http://localhost:8086/updates", form);
        alert("Service updated ✅");
      } else {
        await axios.post("http://localhost:8086/addS", form);
        alert("Service added ✅");
      }
      setForm({ serviceId: "", serviceName: "", serviceType: "", cid: "" });
      setEditing(false);
      fetchServices();
    } catch (err) {
      alert("Error saving service");
    }
  };

  const handleEdit = (s) => {
    setForm({
      serviceId:   s.serviceId,
      serviceName: s.serviceName,
      serviceType: s.serviceType,
      cid:         s.cid
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axios.delete(`http://localhost:8086/deletes/${id}`);
      fetchServices();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const getCatName = (cid) =>
    categories.find(c => c.cid === cid)?.cname || cid;

  const filtered = services.filter(s =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Management</p>
            <h2 className="atb-title">
              Service Types
              <span className="atb-count-pill">{services.length}</span>
            </h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search services…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Form */}
        <div className="atb-form-card">
          <h4 className="atb-form-title">
            {editing ? "✏️ Edit Service Type" : "➕ Add New Service Type"}
          </h4>
          <form onSubmit={handleSubmit} className="atb-form-row atb-form-wrap">
            <input
              className="atb-form-input"
              placeholder="Service ID *"
              type="number"
              value={form.serviceId}
              onChange={e => setForm({ ...form, serviceId: e.target.value })}
              disabled={editing}
              required
            />
            <input
              className="atb-form-input"
              placeholder="Service Name *"
              value={form.serviceName}
              onChange={e => setForm({ ...form, serviceName: e.target.value })}
              required
            />
            <input
              className="atb-form-input"
              placeholder="Service Type (e.g. Online, Offline)"
              value={form.serviceType}
              onChange={e => setForm({ ...form, serviceType: e.target.value })}
            />
            <select
              className="atb-form-input"
              value={form.cid}
              onChange={e => setForm({ ...form, cid: e.target.value })}
              required
            >
              <option value="">Select Category *</option>
              {categories.map(c => (
                <option key={c.cid} value={c.cid}>{c.cname}</option>
              ))}
            </select>
            <button type="submit" className="atb-form-btn">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                type="button"
                className="atb-form-btn-cancel"
                onClick={() => {
                  setEditing(false);
                  setForm({ serviceId: "", serviceName: "", serviceType: "", cid: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="atb-table-wrap">
          <table className="atb-table">
            <thead>
              <tr>
                {["ID", "Service Name", "Type", "Category", "Actions"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.serviceId} className="atb-tr">
                  <td className="atb-td atb-num">{s.serviceId}</td>
                  <td className="atb-td">
                    <strong style={{ color: "white" }}>{s.serviceName}</strong>
                  </td>
                  <td className="atb-td">
                    {s.serviceType
                      ? <span className="atb-badge atb-badge-cat">{s.serviceType}</span>
                      : <span style={{ color: "#2a2620" }}>—</span>
                    }
                  </td>
                  <td className="atb-td">
                    <span className="atb-badge atb-badge-verified">
                      {getCatName(s.cid)}
                    </span>
                  </td>
                  <td className="atb-td">
                    <div className="atb-actions">
                      <button
                        className="atb-btn-verify"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="atb-btn-reject"
                        onClick={() => handleDelete(s.serviceId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="atb-empty">
              <div className="atb-empty-icon">◈</div>
              <p>No service types found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminServiceTypes;