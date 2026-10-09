import { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {
  const [t, setT] = useState([]);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    name: "",
    category: "",
    description: "",
    typicalDuration: 0,
  });

  const load = async () => {
    try {
      setError("");

      const r = await api.get("/crop-templates");
      setT(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load crop templates"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/crop-templates", {
        ...f,
        typicalDuration: Number(f.typicalDuration),
      });

      setF({
        name: "",
        category: "",
        description: "",
        typicalDuration: 0,
      });

      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to add crop template"
      );
    }
  };

  const del = async (id) => {
    try {
      setError("");

      await api.delete(`/crop-templates/${id}`);

      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to delete crop template"
      );
    }
  };

  return (
    <>
      <h1>Admin · Crop Templates</h1>

      {error && <div className="error">{error}</div>}

      <form className="card form" onSubmit={save}>
        <h2>Add Template</h2>

        {[
          "name",
          "category",
          "description",
          "typicalDuration",
        ].map((k) => (
          <label key={k}>
            {k.replace(/([A-Z])/g, " $1")}

            <input
              name={k}
              type={
                k === "typicalDuration"
                  ? "number"
                  : "text"
              }
              value={f[k]}
              onChange={(e) =>
                setF({
                  ...f,
                  [e.target.name]: e.target.value,
                })
              }
              required={k !== "description"}
              min={
                k === "typicalDuration"
                  ? "0"
                  : undefined
              }
            />
          </label>
        ))}

        <button type="submit">Add</button>
      </form>

      <div className="grid">
        {t.map((x) => (
          <div className="card" key={x._id}>
            <b>{x.name}</b>

            <p>{x.description}</p>

            <p>
              <strong>Category:</strong> {x.category}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {x.typicalDuration} days
            </p>

            <button
              type="button"
              className="danger"
              onClick={() => del(x._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

