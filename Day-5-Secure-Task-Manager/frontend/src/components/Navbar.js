import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        background: "#222",
        color: "white",
      }}
    >
      <h3>Task Manager</h3>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;