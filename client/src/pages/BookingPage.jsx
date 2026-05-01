import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    api
      .get(`/services/${serviceId}`)
      .then((res) => setService(res.data.data))
      .catch(() => setError("Service not found"))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/bookings", { serviceId, eventDate, notes });
      setSuccess("Booking created successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Loading service...</div>;

  return (
    <div className="page">
      <div className="container booking-page">
        <div className="page-header">
          <h1>Book a Service</h1>
        </div>

        {service && (
          <div className="booking-service-info">
            <h2>{service.name}</h2>
            <p style={{ color: "var(--text-light)" }}>{service.description}</p>
            <p className="price" style={{ marginTop: "0.5rem" }}>
              &#8377;{service.price?.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <Alert type="error" message={error} onClose={() => setError("")} />
            <Alert type="success" message={success} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input
                  id="eventDate"
                  type="date"
                  className="form-control"
                  value={eventDate}
                  min={minDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  className="form-control"
                  placeholder="Any special requests or details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting || !!success}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
