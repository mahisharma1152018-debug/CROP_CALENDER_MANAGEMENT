import { useEffect, useState } from "react";
import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} from "../services/activityService";
import { getCrops } from "../services/cropService";

export default function Activities() {
  const [a, setA] = useState([]);
  const [c, setC] = useState([]);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    name: "",
    crop: "",
    scheduledDate: "",
    category: "",
    priority: "Medium",
    description: "",
    reminderDate: "",
  });

  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const r = await getActivities();
      setA(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to load activities"
      );
    }
  };

  const loadCrops = async () => {
    try {
      const r = await getCrops();
      setC(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to load crops"
      );
    }
  };

  useEffect(() => {
    load();
    loadCrops();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editing) {
        await updateActivity(editing, f);
      } else {
        await addActivity(f);
      }

      setEditing(null);

      setF({
        name: "",
        crop: "",
        scheduledDate: "",
        category: "",
        priority: "Medium",
        description: "",
        reminderDate: "",
      });

      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to save activity"
      );
    }
  };

  const editActivity = (x) => {
    setEditing(x._id);

    setF({
      name: x.name || "",
      crop: x.crop?._id || x.crop || "",
      scheduledDate: x.scheduledDate
        ? new Date(x.scheduledDate).toISOString().slice(0, 10)
        : "",
      category: x.category || "",
      priority: x.priority || "Medium",
      description: x.description || "",
      reminderDate: x.reminderDate
        ? new Date(x.reminderDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const removeActivity = async (id) => {
    if (!confirm("Delete activity?")) return;

    try {
      await deleteActivity(id);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to delete activity"
      );
    }
  };

  return (
    <>
      <h1>Activities</h1>

      {error && <div className="error">{error}</div>}

      <form className="card form" onSubmit={submit}>
        <h2>{editing ? "Edit" : "Add"} Activity</h2>

        {["name", "category", "description"].map((k) => (
          <label key={k}>
            {k}

            <input
              name={k}
              value={f[k]}
              onChange={(e) =>
                setF({
                  ...f,
                  [k]: e.target.value,
                })
              }
              required={k === "name"}
            />
          </label>
        ))}

        <label>
          Crop

          <select
            name="crop"
            value={f.crop}
            onChange={(e) =>
              setF({
                ...f,
                crop: e.target.value,
              })
            }
            required
          >
            <option value="">Select crop</option>

            {c.map((x) => (
              <option key={x._id} value={x._id}>
                {x.cropName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Scheduled Date

          <input
            type="date"
            name="scheduledDate"
            value={f.scheduledDate}
            onChange={(e) =>
              setF({
                ...f,
                scheduledDate: e.target.value,
              })
            }
            required
          />
        </label>

        <label>
          Reminder Date

          <input
            type="date"
            name="reminderDate"
            value={f.reminderDate}
            onChange={(e) =>
              setF({
                ...f,
                reminderDate: e.target.value,
              })
            }
          />
        </label>

        <label>
          Priority

          <select
            name="priority"
            value={f.priority}
            onChange={(e) =>
              setF({
                ...f,
                priority: e.target.value,
              })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <button type="submit">
          {editing ? "Save Changes" : "Add Activity"}
        </button>
      </form>

      {a.map((x) => (
        <div className="card activity" key={x._id}>
          <div>
            <b>{x.name}</b>

            <span className="muted">
              {x.crop?.cropName} ·{" "}
              {new Date(x.scheduledDate).toLocaleDateString()}
            </span>
          </div>

          <div className="actions">
            <button onClick={() => editActivity(x)}>
              Edit
            </button>

            <button
              className="danger"
              onClick={() => removeActivity(x._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}