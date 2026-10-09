import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCrops, deleteCrop } from "../services/cropService";

export default function Crops() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const r = await getCrops();
      setItems(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load crops"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this crop?")) {
      return;
    }

    try {
      setError("");

      await deleteCrop(id);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to delete crop"
      );
    }
  };

  return (
    <>
      <div className="pagehead">
        <h1>My Crops</h1>

        <Link className="button" to="/crops/add">
          + Add Crop
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {items.map((c) => (
          <div className="card" key={c._id}>
            <h3>{c.cropName}</h3>

            <p>
              {c.variety || "Standard variety"} ·{" "}
              {c.status}
            </p>

            <p>
              Planting:{" "}
              {new Date(
                c.plantingDate
              ).toLocaleDateString()}
            </p>

            <div className="actions">
              <Link to={`/crops/${c._id}`}>
                View
              </Link>

              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!items.length && !error && (
          <div className="card empty">
            No crops yet. Add your first crop.
          </div>
        )}
      </div>
    </>
  );
}
