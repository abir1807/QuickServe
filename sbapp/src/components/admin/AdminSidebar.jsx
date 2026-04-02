import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const links = [
    { to: "/admin/dashboard",  icon: "📊", label: "Dashboard"  },
    { to: "/admin/providers",  icon: "🧑‍🔧", label: "Providers"  },
    { to: "/admin/categories", icon: "📁", label: "Categories" },
    { to: "/admin/servicetypes",   icon: "🛠️", label: "Service Types"  },
    { to: "/admin/services",   icon: "🛠️", label: "Services"   },
    { to: "/admin/users",      icon: "👥", label: "Users"      },
    { to: "/admin/bookings",   icon: "📋", label: "Bookings"   },
  ];

  return (
    <div className="as-sidebar">
      {/* Brand */}
      <div className="as-brand">
        <div className="as-brand-icon">QS</div>
        <div>
          <div className="as-brand-name">QuickServe</div>
          <div className="as-brand-role">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="as-nav">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`as-link ${location.pathname === l.to ? "as-link-active" : ""}`}
          >
            <span className="as-link-icon">{l.icon}</span>
            <span className="as-link-label">{l.label}</span>
            {location.pathname === l.to && <span className="as-link-dot" />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button className="as-logout" onClick={handleLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
}

export default AdminSidebar;
