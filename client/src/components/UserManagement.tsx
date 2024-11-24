import React, { useEffect, useMemo, useState } from "react";
import { Role, User } from "../types";
import { api } from "../services/api";
import UserModal from "./UserModal";
import { UserFormData } from "../schemas/userSchema";
import { FiEdit2, FiTrash2, FiUserPlus, FiSearch } from "react-icons/fi";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<
    Omit<User, "_id"> & { _id?: string }
  >({
    name: "",
    email: "",
    role: "User",
    status: "active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
      if (data.length > 0) {
        setCurrentUser((prev) => ({ ...prev, role: data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const handleAddNew = () => {
    setCurrentUser({
      name: "",
      email: "",
      role: "User",
      status: "active",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setShowModal(true);
  };
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // Searching for users
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtering User on status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Filtering User on rowl
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Sorting User Ascending or Descending
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key].toLowerCase();
      const bValue = b[sortConfig.key].toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortConfig, statusFilter, roleFilter]);

  const handleSort = (key: keyof User) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };
  const handleSave = async (formData: UserFormData) => {
    try {
      if (isEditing && currentUser._id) {
        const updatedUser = await api.updateUser(currentUser._id, formData);
        setUsers(
          users.map((user) =>
            user._id === currentUser._id ? updatedUser : user,
          ),
        );
        toast.success("User updated successfully!");
      } else {
        const newUser = await api.createUser(formData);
        setUsers([...users, newUser]);
        toast.success("User created successfully!");
      }
      setShowModal(false);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error saving user:", axiosError.message);
      toast.error(axiosError.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred while deleting the user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-blue-50 via-gray-50 to-white min-h-screen">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-700 mt-1">
          Manage user accounts and permissions with ease.
        </p>
      </div>
      <button
        onClick={handleAddNew}
        className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <FiUserPlus className="mr-2" />
        Add New User
      </button>
    </div>
  
    {/* Filters Section */}
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
  
      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
        className="border border-gray-300 rounded-full px-4 pe-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
  
      {/* Role Filter */}
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        <option value="all">All Roles</option>
        {roles.map((role) => (
          <option key={role._id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  
    {/* User Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white sticky top-0 z-10">
              <tr>
                {/* Sortable Headers */}
                <th
                  className="px-6 py-4 text-left text-sm font-semibold uppercase cursor-pointer flex items-center gap-2"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? (
                      <FaArrowUpLong />
                    ) : (
                      <FaArrowDownLong />
                    ))}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase hidden md:table-cell">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase hidden sm:table-cell">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-green-100 text-green-800"
                          : user.role === "Moderator"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                      title="Edit user"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 ml-3"
                      title="Delete user"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    {/* No Users Message */}
    {filteredAndSortedUsers.length === 0 && (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    )}
  
    <UserModal
      showModal={showModal}
      user={currentUser}
      roles={roles}
      isEditing={isEditing}
      onClose={() => setShowModal(false)}
      onSave={handleSave}
    />
  </div>
  
  );
};

export default UserManagement;
