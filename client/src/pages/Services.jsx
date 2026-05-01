import { useEffect, useState } from "react";
import api from "../api/axios";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Our Services</h1>
          <p>Browse and book the perfect service for your event</p>
        </div>

        {loading && <div className="loader">Loading services...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid grid-3">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>

        {!loading && !error && services.length === 0 && (
          <div className="empty">
            <h3>No services available</h3>
            <p>Check back later for new offerings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
