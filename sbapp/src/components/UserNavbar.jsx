import { useNavigate } from "react-router-dom";
import "./UserNavbar.css";

function UserNavbar() {
  const navigate  = useNavigate();
  const name      = localStorage.getItem("name");
  const token     = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userEmail");
    navigate("/Home");
  };

  return (
    <nav className="un-nav">
      <div className="un-brand" onClick={() => navigate("/Home")}>
        Quick<em>Serve</em>
      </div>

      <div className="un-links">
        <button className="un-link" onClick={() => navigate("/Home")}>
          ← Home
        </button>
        <button className="un-link" onClick={() => navigate("/UserBooking")}>
          My Bookings
        </button>
      </div>

      <div className="un-right">
        {token && name && (
          <div className="un-user">
            <div className="un-avatar">{name[0].toUpperCase()}</div>
            <span className="un-name">{name}</span>
          </div>
        )}
        <button className="un-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default UserNavbar;