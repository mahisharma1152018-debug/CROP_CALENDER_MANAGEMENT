import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
export default function Register() {
  const [f, setF] = useState({
      name: "",
      email: "",
      password: "",
      confirm: "",
      phone: "",
      location: "",
      role: "farmer",
    }),
    [error, setError] = useState("");
  const nav = useNavigate();
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return setError("Passwords do not match");
    try {
      await register(f);
      nav("/login");
    } catch (x) {
      setError(x.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="auth">
      <form className="card form" onSubmit={submit}>
        <h1>Create account</h1>
        {error && <div className="error">{error}</div>}
        {["name", "email", "phone", "location"].map((k) => (
          <label key={k}>
            {k[0].toUpperCase() + k.slice(1)}
            <input
              name={k}
              value={f[k]}
              onChange={change}
              required={k !== "phone"}
            />
          </label>
        ))}
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="6"
            value={f.password}
            onChange={change}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            name="confirm"
            type="password"
            value={f.confirm}
            onChange={change}
            required
          />
        </label>
        <button>Create account</button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
