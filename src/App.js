import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import useStore from "./store/useStore";
import Navbar from "./components/Navbar";
import Board from "./components/Board";
import Login from "./components/Login";

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? { uid: user.uid, email: user.email } : null);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
