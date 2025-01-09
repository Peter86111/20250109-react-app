import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export const Logout = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = NET({
      el: vantaRef.current,
      THREE,
      color: 0xff0000, // Karácsonyi piros
      backgroundColor: 0x001f3f, // Mélykék háttér
      points: 12.0,
      maxDistance: 20.0,
      spacing: 18.0,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <div ref={vantaRef} style={{ height: "100vh", width: "100%", position: "relative" }}>
      <div style={styles.container}>
        <h1 style={styles.title}>🎄 Kellemes Ünnepeket! 🎅</h1>
        <p style={styles.message}>Köszönjük, hogy velünk voltál! 🌟</p>
        <button onClick={handleLogout} style={styles.button}>
          Kijelentkezés
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fehér áttetsző doboz
    borderRadius: "15px",
    padding: "20px 30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "300px",
  },
  title: {
    color: "#ff4500", // Karácsonyi piros
    marginBottom: "10px",
  },
  message: {
    color: "#333",
    fontSize: "16px",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#28a745", // Zöld gomb
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
