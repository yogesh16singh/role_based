import { NavLink } from "react-router-dom";
import { MenuItems } from "../types";
import { LuLayoutDashboard, LuUsers, LuMenu, LuX } from "react-icons/lu";
import { GoPasskeyFill } from "react-icons/go";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems: MenuItems[] = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard className="w-5 h-5" />, path: "/" },
    { id: "users", label: "Users", icon: <LuUsers className="w-5 h-5" />, path: "/users" },
    { id: "roles", label: "Roles", icon: <GoPasskeyFill className="w-5 h-5" />, path: "/roles" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
    {/* Toggle Button */}
    <button
      onClick={toggleSidebar}
      className="fixed md:hidden top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-400"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
    </button>
  
    {/* Backdrop */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        onClick={toggleSidebar}
        aria-hidden="true"
      />
    )}
  
    {/* Sidebar */}
    <aside
      className={`
        fixed md:sticky top-0 left-0 z-40
        w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-2xl font-bold text-purple-400">Admin Panel</span>
      </div>
  
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-purple-600 hover:text-white"
              }`
            }
          >
            <span className="inline-flex items-center justify-center w-8">
              {item.icon}
            </span>
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
  
      
    </aside>
  </>
  

  );
};

export default Sidebar;
