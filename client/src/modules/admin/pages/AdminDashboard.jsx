const stats = [
  { title: "Total Bookings", value: "128" },
  { title: "Customers", value: "86" },
  { title: "Registered Vendors", value: "24" },
  { title: "Pending Quotations", value: "12" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your events and operations in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold">Welcome to Eventora CRM</h2>
        <p className="mt-2 text-sm text-gray-500">
          Upcoming events and recent booking activity will appear here.
        </p>
      </section>
    </div>
  );
}