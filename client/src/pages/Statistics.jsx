import { useEffect, useState } from "react";
import { dashboard } from "../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Statistics() {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");

        const r = await dashboard();
        setD(r.data.data);
      } catch (e) {
        setError(
          e.response?.data?.message ||
            "Unable to load statistics"
        );
      }
    };

    load();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!d) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Statistics</h1>

      <div className="stats">
        {Object.entries(d.stats).map(([k, v]) => (
          <div className="card stat" key={k}>
            <span>
              {k.replace(/([A-Z])/g, " $1")}
            </span>

            <strong>{v}</strong>
          </div>
        ))}
      </div>

      <div className="card chart">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={d.cropProgress}>
            <XAxis dataKey="cropName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

