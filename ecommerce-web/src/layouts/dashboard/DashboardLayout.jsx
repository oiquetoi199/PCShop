import React from "react";
import { Outlet } from "react-router-dom";
import ThemeContextProvider from "../../context/ThemeContextProvider";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navbar";

// Bố trí giao diện chung cho khu vực quản trị.
const DashboardLayout = () => {
  return (
    <ThemeContextProvider>
      <div className="flex h-screen">
        <div className="hidden md:block md:w-48 lg:w-64 bg-gray-800 text-white flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
          <div className="md:hidden flex">
            <Sidebar className="w-48 bg-gray-800 text-white flex-shrink-0" />
            <Navbar />
          </div>

          <div className="hidden md:block">
            <Navbar />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
};

export default DashboardLayout;