import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user } = useAuth();

  const [f, setF] = useState(user || {});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setF(user || {});
  }, [user]);

  const save = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMsg("");

      await api.put("/users/profile", f);

      setMsg("Profile updated successfully.");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to update profile"
      );
    }
  };

  return (
    <form className="card form" onSubmit={save}>
      <h1>Profile</h1>

      {error && <div className="error">{error}</div>}

      {["name", "email", "phone", "location", "farmSize"].map(
        (k) => (
          <label key={k}>
            {k.replace(/([A-Z])/g, " $1")}

            <input
              value={f[k] || ""}
              onChange={(e) =>
                setF({
                  ...f,
                  [k]: e.target.value,
                })
              }
            />
          </label>
        )
      )}

      <button type="submit">Save</button>

      {msg && <p className="success">{msg}</p>}
    </form>
  );
}
