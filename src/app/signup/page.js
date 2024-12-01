"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const localStyle = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  signUpBox: {
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
    color: "#333",
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
};

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign Up failed");
      }

      router.push("/login"); // Navigate to login after successful sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={localStyle.container}>
      <div style={localStyle.signUpBox}>
        <h1 style={localStyle.header}>Sign Up</h1>
        {error && <p style={localStyle.errorMessage}>{error}</p>}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={localStyle.input}
          />
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
        <button onClick={handleSignUp} style={localStyle.button}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
