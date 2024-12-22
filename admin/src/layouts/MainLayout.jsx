import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (state) => {
    setIsSidebarOpen(state);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar for the navigation around the Routes */}
      <Sidebar className='min-h-screen fixed top-0 ' isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content (Header + Dynamic Page Content) */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <Header className='fixed  top-0 border-b border-orange-400' toggleSidebar={toggleSidebar} />

        {/* Dynamic Page Content */}
        <main className="flex-1 lg:pl-[22%] p-4 lg:pt-[6%] md:pt-[10%] pt-[24%] w-full bg-orange-100 overflow-y-auto ">
          {/* child routes go here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
