import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import useStore from "../store/useStore";

function Navbar() {
  const user = useStore((state) => state.user);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="container">
      <h1>Task Management</h1>
      {user ? (
        <>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
