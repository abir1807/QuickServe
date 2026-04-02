import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    axios.get("http://localhost:8086/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;
    axios.delete(`http://localhost:8086/admin/users/${id}`)
      .then(() => fetchUsers())
      .catch(() => alert("Delete failed"));
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.contactNumber?.includes(search)
  );

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Management</p>
            <h2 className="atb-title">Users <span className="atb-count-pill">{users.length}</span></h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="atb-table-wrap">
          <table className="atb-table">
            <thead>
              <tr>
                {["#", "Name", "Email", "Contact", "Action"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className="atb-tr">
                  <td className="atb-td atb-num">{i + 1}</td>
                  <td className="atb-td">
                    <div className="atb-provider-cell">
                      <div className="atb-avatar atb-avatar-user">
                        {u.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <strong className="atb-name">{u.name}</strong>
                    </div>
                  </td>
                  <td className="atb-td atb-email">{u.email}</td>
                  <td className="atb-td">{u.contactNumber}</td>
                  <td className="atb-td">
                    <button className="atb-btn-reject" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="atb-empty">
              <div className="atb-empty-icon">◈</div>
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
