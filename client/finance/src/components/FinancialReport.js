import React, { useEffect, useState } from "react";
import api from "../api";

export default function FinancialReport() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    unitsSold: "",
    pricePerUnit: "",
    cost: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    setLoading(true);
    setError(null);
    api
      .get("/admin/finance/financial-inputs")
      .then((res) => {
        setRecords(res.data.financialRecords);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch financial report");
        setLoading(false);
      });
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setFormData({
      unitsSold: record.inputData.unitsSold,
      pricePerUnit: record.inputData.pricePerUnit,
      cost: record.inputData.cost,
    });
  };

  const handleSave = () => {
    if (
      formData.unitsSold === "" ||
      formData.pricePerUnit === "" ||
      formData.cost === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    if (
      Number(formData.unitsSold) <= 0 ||
      Number(formData.pricePerUnit) <= 0 ||
      Number(formData.cost) < 0
    ) {
      alert("Units Sold and Price per Unit must be positive numbers. Cost cannot be negative.");
      return;
    }

    setSaving(true);
    api
      .put(`/admin/finance/financial-inputs/${editingRecord._id}`, {
        inputData: {
          unitsSold: Number(formData.unitsSold),
          pricePerUnit: Number(formData.pricePerUnit),
          cost: Number(formData.cost),
        },
      })
      .then((res) => {
        const updatedRecord = res.data.updatedRecord;
        setRecords((prev) =>
          prev.map((r) => (r._id === updatedRecord._id ? updatedRecord : r))
        );
        setEditingRecord(null);
        setFormData({ unitsSold: "", pricePerUnit: "", cost: "" });
      })
      .catch(() => {
        alert("Failed to save changes.");
      })
      .finally(() => setSaving(false));
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setFormData({ unitsSold: "", pricePerUnit: "", cost: "" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setDeletingId(id);
    api
      .delete(`/admin/finance/financial-inputs/${id}`)
      .then(() => {
        setRecords((prev) => prev.filter((r) => r._id !== id));
      })
      .catch((err) => {
        console.error("Delete failed:", err.response ? err.response.data : err.message);
        alert("Failed to delete record.");
      })
      .finally(() => setDeletingId(null));
  };

  // Format numbers to 2 decimals
  const formatNumber = (val) => Number(val).toFixed(2);

  if (loading) return <div>Loading financial report...</div>;

  return (
    <div className="mt-5">
      <h4>Financial Report</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {records.length === 0 ? (
        <div className="alert alert-info">No financial data available.</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Units Sold</th>
              <th>Price/Unit</th>
              <th>Cost</th>
              <th>Total Revenue</th>
              <th>Profit</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.name || "Unknown"}</td>
                <td>{r.userId?.email || "N/A"}</td>
                <td>{formatNumber(r.inputData.unitsSold)}</td>
                <td>{formatNumber(r.inputData.pricePerUnit)}</td>
                <td>{formatNumber(r.inputData.cost)}</td>
                <td>{formatNumber(r.calculatedResult.totalRevenue)}</td>
                <td>{formatNumber(r.calculatedResult.profit)}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEditClick(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(r._id)}
                    disabled={deletingId === r._id}
                  >
                    {deletingId === r._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingRecord && (
        <div className="card mt-4">
          <div className="card-body">
            <h5>
              Edit Financial Record for {editingRecord.userId?.name || "Unknown"}
            </h5>
            <div className="mb-3">
              <label className="form-label" htmlFor="unitsSoldInput">
                Units Sold
              </label>
              <input
                id="unitsSoldInput"
                type="number"
                className="form-control"
                value={formData.unitsSold}
                onChange={(e) =>
                  setFormData({ ...formData, unitsSold: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="pricePerUnitInput">
                Price per Unit
              </label>
              <input
                id="pricePerUnitInput"
                type="number"
                className="form-control"
                value={formData.pricePerUnit}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerUnit: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="costInput">
                Cost
              </label>
              <input
                id="costInput"
                type="number"
                className="form-control"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
              />
            </div>
            <button
              className="btn btn-success me-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
