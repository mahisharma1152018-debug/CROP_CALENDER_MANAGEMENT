import { Link, useNavigate } from "react-router-dom";
import { LogOut, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header>
      <Link className="brand" to="/dashboard">
        <Leaf /> CropCalendar
      </Link>
      <nav>
        {user && (
          <>
            <Link to="/crops">Crops</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/notifications">Notifications</Link>
            <Link to="/statistics">Statistics</Link>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button
              className="ghost"
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
