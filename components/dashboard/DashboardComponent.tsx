"use client";
import { useLocale } from "@/context/LocaleContext";
import {
  UserIcon,
  CategoriesIcon,
  ProductsIcon,
  EnvelopeIcon
} from "@/icons";

const DashboardComponent = () => {
  const { messages } = useLocale();
  const mockStats = [
  { 
    title: messages["categories_total"] || "Total Categories", 
    value: "10", 
    icon: <CategoriesIcon />, 
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
  },
  { 
    title: messages["contact_requestes_total"] || "Total Contact Requests", 
    value: "34", 
    icon: <EnvelopeIcon />, 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
  },
  { 
    title: messages["products_total"] || "Total Products", 
    value: "100", 
    icon: <ProductsIcon />, 
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" 
  },
  { 
    title: messages["users_total"] || "Total Users", 
    value: "6", 
    icon: <UserIcon />, 
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" 
  },
];
  return (
    <div className="space-y-6 lg:space-y-8">
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <div 
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className={`p-2 rounded-full w-fit mb-3 ${stat.color}`}>
              {stat.icon} 
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardComponent;