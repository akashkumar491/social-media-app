"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../authContext/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.token);
      router.push("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  const localStyle = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
    },
    loginBox: {
      maxWidth: "400px",
      width: "100%",
      padding: "20px",
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    errorMessage: {
      color: "red",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#6200EA",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    },
    footer: {
      marginTop: "20px",
      textAlign: "center",
    },
    link: {
      color: "#6200EA",
      textDecoration: "underline",
      cursor: "pointer",
    },
  };

  return (
    <div style={localStyle.container}>
      <div style={localStyle.loginBox}>
        <h1 style={localStyle.header}>Login</h1>
        {error && <p style={localStyle.errorMessage}>{error}</p>}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={localStyle.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={localStyle.input}
          />
        </div>
        <button onClick={handleLogin} style={localStyle.button}>
          Login
        </button>
        <div style={localStyle.footer}>
          <p>
            Don't have an account?{" "}
            <a href="/signup" style={localStyle.link}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
