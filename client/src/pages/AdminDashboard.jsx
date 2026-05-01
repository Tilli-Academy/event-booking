import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import Alert from "../components/Alert";

const FILTERS = ["all", "pending", "accepted", "rejected"];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchBookings = useCallback(() => {
    setLoading(true);
    const query = filter !== "all" ? `?status=${filter}` : "";
    api
      .get(`/admin/bookings${query}`)
      .then((res) => setBookings(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, status) => {
    setActionError("");
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? res.data.data : b))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || `Failed to ${status} booking`);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage all event bookings</p>
        </div>

        <Alert type="error" message={actionError} onClose={() => setActionError("")} />

        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="loader">Loading bookings...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty">
            <h3>No bookings found</h3>
            <p>
              {filter !== "all"
                ? `No ${filter} bookings at the moment.`
                : "No bookings have been made yet."}
            </p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Service</th>
                    <th>Event Date</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div>{b.user?.name || "—"}</div>
                        <small style={{ color: "var(--text-light)" }}>
                          {b.user?.email}
                        </small>
                      </td>
                      <td>{b.service?.name || "—"}</td>
                      <td>{formatDate(b.eventDate)}</td>
                      <td style={{ maxWidth: "200px" }}>
                        {b.notes || <span style={{ color: "var(--text-light)" }}>—</span>}
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        {b.status === "pending" ? (
                          <div className="actions">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleStatusChange(b._id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleStatusChange(b._id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
