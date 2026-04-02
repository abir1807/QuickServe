import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ cid: "", cname: "" });
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCategories = () => {
    axios.get("http://localhost:8086/api/fetch")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put("http://localhost:8086/api/update", form);
        alert("Category updated ✅");
      } else {
        await axios.post("http://localhost:8086/api/add", form);
        alert("Category added ✅");
      }
      setForm({ cid: "", cname: "" });
      setEditing(false);
      fetchCategories();
    } catch (err) {
      alert("Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ cid: cat.cid, cname: cat.cname });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (cid) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`http://localhost:8086/api/delete/${cid}`);
      fetchCategories();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = categories.filter(c =>
    c.cname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Management</p>
            <h2 className="atb-title">
              Categories <span className="atb-count-pill">{categories.length}</span>
            </h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Add / Edit Form */}
        <div className="atb-form-card">
          <h4 className="atb-form-title">
            {editing ? "✏️ Edit Category" : "➕ Add New Category"}
          </h4>
          <form onSubmit={handleSubmit} className="atb-form-row">
            <input
              className="atb-form-input"
              placeholder="Category ID (e.g. 1)"
              type="number"
              value={form.cid}
              onChange={e => setForm({ ...form, cid: e.target.value })}
              required
              disabled={editing}
            />
            <input
              className="atb-form-input"
              placeholder="Category Name"
              value={form.cname}
              onChange={e => setForm({ ...form, cname: e.target.value })}
              required
            />
            <button type="submit" className="atb-form-btn">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button type="button" className="atb-form-btn-cancel"
                onClick={() => { setEditing(false); setForm({ cid: "", cname: "" }); }}>
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
                {["ID", "Category Name", "Actions"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(cat => (
                <tr key={cat.cid} className="atb-tr">
                  <td className="atb-td atb-num">{cat.cid}</td>
                  <td className="atb-td">
                    <strong className="atb-name">{cat.cname}</strong>
                  </td>
                  <td className="atb-td">
                    <div className="atb-actions">
                      <button className="atb-btn-verify" onClick={() => handleEdit(cat)}>
                        Edit
                      </button>
                      <button className="atb-btn-reject" onClick={() => handleDelete(cat.cid)}>
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
              <p>No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
