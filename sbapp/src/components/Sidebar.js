import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("provider");
    navigate("/PrroviderLogin");
  };

  const links = [
    { to: "/servicedashboard", icon: "◈", label: "Dashboard"       },
    { to: "/Profile",          icon: "◉", label: "Update Profile"  },
    { to: "/MyServices",       icon: "◆", label: "My Services"     },
    { to: "/MyBookings",       icon: "◇", label: "My Bookings"     },
  ];

  return (
    <div className="sb-sidebar">
      <div className="sb-brand">
        <div className="sb-brand-mark">
          <span>QS</span>
        </div>
        <div>
          <div className="sb-brand-name">Quick<em>Serve</em></div>
          <div className="sb-brand-role">Provider Portal</div>
        </div>
      </div>

      <nav className="sb-nav">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`sb-link ${location.pathname === l.to ? "sb-link-active" : ""}`}
          >
            <span className="sb-link-icon">{l.icon}</span>
            <span className="sb-link-label">{l.label}</span>
            {location.pathname === l.to && <span className="sb-link-dot" />}
          </Link>
        ))}
      </nav>

      <button className="sb-logout" onClick={handleLogout}>
        <span>↩</span>
        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
