import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar flex justify-between items-center px-8 py-4 relative overflow-hidden">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold tracking-wide text-title">
          Task Master Pro
        </h1>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/">
                <button className="btn-primary px-6 py-3 font-bold">
                  🚀 Dashboard
                </button>
              </Link>
              <Link to="/calendar">
                <button className="btn-secondary px-6 py-3 font-bold">
                  📅 Calendar
                </button>
              </Link>
              <div className="flex items-center gap-3 ml-4 pl-4" style={{borderLeft: '1px solid rgba(255,255,255,0.1)'}}>
                <span className="text-sm font-medium text-secondary">👋 Hello, {user.name?.split(' ')[0]}</span>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105" style={{background: '#EF4444', color: '#FFE4E6'}}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary px-6 py-3 font-bold">
                  🔐 Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary px-6 py-3 font-bold">
                  ✨ Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;