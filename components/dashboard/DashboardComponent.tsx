"use client";

import { useLocale } from "@/context/LocaleContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";

import {
  UserIcon,
  CategoriesIcon,
  ProductsIcon,
  EnvelopeIcon,
} from "@/icons";

const DashboardComponent = () => {
  const { messages } = useLocale();
  const { stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-xl border border-gray-200 bg-white p-5 animate-pulse dark:border-gray-800 dark:bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <p className="text-red-500">
        {messages["error_loading"] || "Failed to load dashboard statistics"}
      </p>
    );
  }

  const dashboardStats = [
    {
      title: messages["total_categories"] || "Total Categories",
      value: stats.totalCategories,
      icon: <CategoriesIcon />,
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      title: messages["total_products"] || "Total Products",
      value: stats.totalProducts,
      icon: <ProductsIcon />,
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    {
      title: messages["total_users"] || "Total Users",
      value: stats.totalUsers,
      icon: <UserIcon />,
      color:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    },
    {
      title:
        messages["total_contact_requestes"] ||
        "Total Contact Requests",
      value: stats.totalContactRequests,
      icon: <EnvelopeIcon />,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className={`p-2 rounded-full w-fit mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardComponent;
