import React, { useState } from "react";
import api from "../api";

export default function FinanceForm() {
  const [form, setForm] = useState({ unitsSold: "", pricePerUnit: "", cost: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { unitsSold, pricePerUnit, cost } = form;

    if (!unitsSold || !pricePerUnit || !cost) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/finance/submit", { inputData: form });
      setResult(res.data.calculatedResult);
    } catch {
      alert("Submission failed (are you logged in?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h2 className="card-title text-center mb-4">Financial Input</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="unitsSold">Units Sold</label>
                <input
                  type="number"
                  id="unitsSold"
                  className="form-control"
                  placeholder="Enter units sold"
                  value={form.unitsSold}
                  onChange={e => setForm({ ...form, unitsSold: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="pricePerUnit">Price per Unit</label>
                <input
                  type="number"
                  id="pricePerUnit"
                  className="form-control"
                  placeholder="Enter price per unit"
                  value={form.pricePerUnit}
                  onChange={e => setForm({ ...form, pricePerUnit: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="cost">Cost</label>
                <input
                  type="number"
                  id="cost"
                  className="form-control"
                  placeholder="Enter cost"
                  value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            {result && (
              <div className="alert alert-info mt-4">
                <p><strong>Total Revenue:</strong> ${result.totalRevenue}</p>
                <p><strong>Profit:</strong> ${result.profit}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
