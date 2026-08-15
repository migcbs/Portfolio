import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [clients, projects, reviews, unreadLeads] = await Promise.all([
    prisma.client.count(),
    prisma.portfolioProject.count(),
    prisma.review.count(),
    prisma.lead.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Clientes", value: clients },
    { label: "Proyectos", value: projects },
    { label: "Reviews", value: reviews },
    { label: "Leads sin leer", value: unreadLeads },
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
