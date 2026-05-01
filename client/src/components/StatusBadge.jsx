const colorMap = {
  pending: "badge-warning",
  accepted: "badge-success",
  rejected: "badge-danger",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${colorMap[status] || ""}`}>{status}</span>;
}
