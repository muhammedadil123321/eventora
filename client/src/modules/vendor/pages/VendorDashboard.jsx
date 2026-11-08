
const stats = [
  { title: "New Opportunities", value: "08" },
  { title: "My Applications", value: "12" },
  { title: "Active Assignments", value: "04" },
  { title: "Pending Payments", value: "₹25,000" },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's your business activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">
              {item.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">
            Recent Opportunities
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            New matching event opportunities will appear here.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">
            Recent Assignments
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Your assigned events will appear here.
          </p>
        </section>

      </div>
    </div>
  );
}
