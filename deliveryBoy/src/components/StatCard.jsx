function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="text-primary text-3xl">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
