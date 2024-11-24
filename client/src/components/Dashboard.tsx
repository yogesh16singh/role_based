import React, { useEffect, useState } from "react";
import { FiUsers, FiKey, FiShield, FiUserCheck } from "react-icons/fi";
import { api } from "../services/api";
import { User, Role } from "../types";
import { useNavigate } from "react-router-dom";

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface UserRole {
  name: string;
  userCount: number;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersPerRole, setUsersPerRole] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        setUsers(usersData);
        setRoles(rolesData);

        const userRoleCounts = rolesData.map((role) => ({
          name: role.name,
          userCount: usersData.filter((user) => user.role === role.name).length,
        }));

        setUsersPerRole(userRoleCounts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats: StatItem[] = [
    {
      label: "Total Users",
      value: users.length,
      icon: <FiUsers className="w-7 h-7" />,
      color: "bg-blue-500",
      path: "/users",
    },
    {
      label: "Total Roles",
      value: roles.length,
      icon: <FiKey className="w-7 h-7" />,
      color: "bg-green-500",
      path: "/roles",
    },
    {
      label: "Total Permissions",
      value: roles.reduce(
        (acc, role) => acc + (role.permissions?.length || 0),
        0,
      ),
      icon: <FiShield className="w-7 h-7" />,
      color: "bg-purple-500",
      path: "/roles",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 flex items-center">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-2 h-10 mr-4 rounded-full"></span>
        Dashboard
      </h2>
  
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(stat.path)}
          >
            <div className={`h-2 ${stat.color} rounded-t-2xl`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`p-4 rounded-full shadow-inner`}
                  style={{ background: `${stat.color.replace('bg-', '')}50` }}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* Users Per Role Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-indigo-50 to-pink-50">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiUserCheck className="w-6 h-6 mr-3 text-purple-600" />
            Users per Role
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersPerRole.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg hover:bg-gradient-to-l hover:from-indigo-50 hover:to-pink-50 transition-all duration-300 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span className="font-medium text-gray-800">{role.name}</span>
                </div>
                <div>
                  <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-sm font-semibold">
                    {role.userCount} users
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Dashboard;
