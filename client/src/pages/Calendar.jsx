import { useEffect, useState } from "react";
import {
  getActivities,
  completeActivity,
} from "../services/activityService";
import ActivityCard from "../components/ActivityCard";

export default function Calendar() {
  const [a, setA] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const r = await getActivities({
        search: q,
        status,
      });

      setA(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load activities"
      );
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleComplete = async (id) => {
    try {
      await completeActivity(id, {});
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to complete activity"
      );
    }
  };

  return (
    <>
      <div className="pagehead">
        <h1>Calendar</h1>

        <input
          placeholder="Search activities..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              load();
            }
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Overdue</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {a.map((x) => (
        <ActivityCard
          key={x._id}
          a={x}
          onComplete={handleComplete}
        />
      ))}

      {!a.length && !error && (
        <div className="card empty">
          No matching activities.
        </div>
      )}
    </>
  );
}
