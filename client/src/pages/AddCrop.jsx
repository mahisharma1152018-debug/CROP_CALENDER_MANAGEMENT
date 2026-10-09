import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCrop, templates } from "../services/cropService";

export default function AddCrop() {
  const [t, setT] = useState([]);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    cropTemplate: "",
    cropName: "",
    variety: "",
    plantingDate: "",
    expectedHarvestDate: "",
    farmSize: "",
    location: "",
    soilType: "",
    irrigationMethod: "",
    notes: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const r = await templates();
        setT(r.data.data);
      } catch (e) {
        setError(
          e.response?.data?.message || "Unable to load crop templates"
        );
      }
    };

    loadTemplates();
  }, []);

  const change = (e) => {
    setF({
      ...f,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const r = await addCrop(f);
      nav(`/crops/${r.data.data._id}`);
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to add crop"
      );
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h1>Add Crop</h1>

      {error && <div className="error">{error}</div>}

      <label>
        Crop Template

        <select
          name="cropTemplate"
          value={f.cropTemplate}
          onChange={(e) => {
            const x = t.find(
              (item) => item._id === e.target.value
            );

            setF({
              ...f,
              cropTemplate: e.target.value,
              cropName: x?.name || "",
            });
          }}
          required
        >
          <option value="">Select crop</option>

          {t.map((x) => (
            <option value={x._id} key={x._id}>
              {x.name}
            </option>
          ))}
        </select>
      </label>

      {[
        "variety",
        "farmSize",
        "location",
        "soilType",
        "irrigationMethod",
        "notes",
      ].map((k) => (
        <label key={k}>
          {k.replace(/([A-Z])/g, " $1")}

          <input
            name={k}
            value={f[k]}
            onChange={change}
          />
        </label>
      ))}

      <label>
        Planting Date

        <input
          type="date"
          name="plantingDate"
          value={f.plantingDate}
          onChange={change}
          required
        />
      </label>

      <label>
        Expected Harvest Date

        <input
          type="date"
          name="expectedHarvestDate"
          value={f.expectedHarvestDate}
          onChange={change}
        />
      </label>

      <button type="submit">
        Add & Generate Calendar
      </button>
    </form>
  );
}

