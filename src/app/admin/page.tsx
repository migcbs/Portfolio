import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [projects, reviews, unreadLeads, unreadRequests] = await Promise.all([
    prisma.portfolioProject.count(),
    prisma.review.count(),
    prisma.lead.count({ where: { read: false } }),
    prisma.bookingRequest.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Proyectos", value: projects },
    { label: "Reviews", value: reviews },
    { label: "Leads sin leer", value: unreadLeads },
    { label: "Solicitudes sin leer", value: unreadRequests },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="liquid-glass rounded-xl p-4">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
