import { useEffect, useState } from "react";
import {
  notifications,
  readNotification,
  readAll,
} from "../services/notificationService";

export default function Notifications() {
  const [n, setN] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const r = await notifications();
      setN(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to load notifications"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    try {
      setError("");

      await readAll();
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to mark notifications as read"
      );
    }
  };

  const markRead = async (id) => {
    try {
      setError("");

      await readNotification(id);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to mark notification as read"
      );
    }
  };

  return (
    <>
      <div className="pagehead">
        <h1>Notifications</h1>

        <button type="button" onClick={markAllRead}>
          Mark all read
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {n.map((x) => (
        <div
          className={`card ${x.isRead ? "" : "unread"}`}
          key={x._id}
        >
          <b>{x.title}</b>

          <p>{x.message}</p>

          {!x.isRead && (
            <button
              type="button"
              onClick={() => markRead(x._id)}
            >
              Mark read
            </button>
          )}
        </div>
      ))}

      {!n.length && !error && (
        <div className="card empty">
          No notifications.
        </div>
      )}
    </>
  );
}