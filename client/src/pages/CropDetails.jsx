import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCrop } from "../services/cropService";
import { completeActivity } from "../services/activityService";
import ActivityCard from "../components/ActivityCard";

export default function CropDetails() {
  const { id } = useParams();

  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const r = await getCrop(id);
      setD(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load crop details"
      );
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const done = async (activityId) => {
    try {
      await completeActivity(activityId, {});
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to complete activity"
      );
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!d) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{d.crop.cropName}</h1>

      <div className="card">
        <p>
          {d.crop.variety || "Standard variety"} ·{" "}
          {d.crop.status}
        </p>

        <p>
          Planting:{" "}
          {new Date(
            d.crop.plantingDate
          ).toLocaleDateString()}
        </p>

        <div className="progress">
          <span
            style={{
              width: `${d.progress}%`,
            }}
          />
        </div>

        <b>{d.progress}% complete</b>
      </div>

      <h2>Activities</h2>

      {d.activities.length ? (
        d.activities.map((a) => (
          <ActivityCard
            key={a._id}
            a={a}
            onComplete={done}
          />
        ))
      ) : (
        <div className="card empty">
          No activities for this crop.
        </div>
      )}
    </>
  );
}
