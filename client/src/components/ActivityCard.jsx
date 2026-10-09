import { Check } from "lucide-react";
export default function ActivityCard({ a, onComplete }) {
  return (
    <div className="card activity">
      <div>
        <b>{a.name}</b>
        <span className="muted">
          {a.crop?.cropName || a.crop?.name || "Crop"} ·{" "}
          {new Date(a.scheduledDate).toLocaleDateString()}
        </span>
        <span className={`pill ${a.status.toLowerCase()}`}>{a.status}</span>
      </div>
      {a.status !== "Completed" && (
        <button onClick={() => onComplete(a._id)}>
          <Check size={16} /> Complete
        </button>
      )}
    </div>
  );
}
