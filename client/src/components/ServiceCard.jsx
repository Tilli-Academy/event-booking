import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="card service-card">
      <div className="card-body">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-card-footer">
          <span className="price">&#8377;{service.price?.toLocaleString("en-IN")}</span>
          <Link to={`/book/${service._id}`} className="btn btn-primary btn-sm">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
