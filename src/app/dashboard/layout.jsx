import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 md:ml-64 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}
