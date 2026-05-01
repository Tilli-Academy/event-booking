import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

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
          <h1>My Bookings</h1>
          <p>Welcome back, {user?.name}</p>
        </div>

        {loading && <div className="loader">Loading bookings...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty">
            <h3>No bookings yet</h3>
            <p>Browse our services and make your first booking!</p>
            <Link to="/services" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              View Services
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Event Date</th>
                    <th>Status</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.service?.name || "—"}</td>
                      <td>{formatDate(b.eventDate)}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>{formatDate(b.createdAt)}</td>
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
