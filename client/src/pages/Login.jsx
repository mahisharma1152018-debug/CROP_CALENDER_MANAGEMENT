import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState("");
    
  const { login } = useAuth(),
    nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      nav("/dashboard");
    } catch (x) {
      setError(x.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="auth">
      <form className="card form" onSubmit={submit}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your crops.</p>
        {error && <div className="error">{error}</div>}
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength="6"
            required
          />
        </label>
        <button>Login</button>
        <p>
          New farmer? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}
