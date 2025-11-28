import React, { useEffect, useState } from "react";
import { apiGet, apiPost, BACKEND_URL } from "../api";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    apiGet("/auth/airtable/login-status").then((res) => {
      setLoggedIn(res.loggedIn);
    });
  }, []);

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/airtable/login`;
  };

  const logout = () => {
    apiPost("/auth/airtable/logout")
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      })
      .catch(() => alert("Logout failed"));
  };

  return (
    <div>
      <h1>Airtable Forms</h1>

      <button disabled={loggedIn} onClick={handleLogin}>
        Login with Airtable
      </button>

      <button disabled={!loggedIn} onClick={logout} style={{ marginLeft: 12 }}>
        Logout
      </button>

      {loggedIn ? (
        <p style={{ color: "green" }}>You are logged in</p>
      ) : (
        <p style={{ color: "red" }}>Not logged in, Please login</p>
      )}

      <p>After login, go to Form Builder.</p>
    </div>
  );
}
