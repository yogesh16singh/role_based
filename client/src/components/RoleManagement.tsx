import React, { useState, useEffect } from "react";
import { Role } from "../types";
import { api } from "../services/api";
import RoleModal from "./RoleModal";
import { FiEdit2, FiTrash2, FiUserPlus, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<
    Omit<Role, "_id"> & { _id?: string }
  >({
    name: "",
    permissions: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch roles",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentRole({ name: "", permissions: [] });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing && currentRole._id) {
        const updatedRole = await api.updateRole(currentRole._id, currentRole);
        setRoles(
          roles.map((role) =>
            role._id === currentRole._id ? updatedRole : role,
          ),
        );
        toast.success("Role updated successfully");
      } else {
        const newRole = await api.createRole(currentRole);
        setRoles([...roles, newRole]);
        toast.success("New role created successfully");
      }
      setShowModal(false);
      setCurrentRole({ name: "", permissions: [] });
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save role",
      );
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await api.deleteRole(id);
      setRoles(roles.filter((role) => role._id !== id));
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete role",
      );
    }
  };

  const handleRoleNameChange = (name: string) => {
    setCurrentRole({ ...currentRole, name });
  };

  const togglePermission = (permission: string) => {
    setCurrentRole({
      ...currentRole,
      permissions: currentRole.permissions.includes(permission)
        ? currentRole.permissions.filter((p) => p !== permission)
        : [...currentRole.permissions, permission],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-gray-50 to-white space-y-8 min-h-screen">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiShield className="mr-3 text-indigo-500" />
          Role Management
        </h2>
        <p className="text-sm text-gray-700 mt-1">
          Manage roles and define permissions seamlessly.
        </p>
      </div>
      <button
        onClick={handleAddNew}
        className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <FiUserPlus className="mr-2" />
        Add New Role
      </button>
    </div>
  
    {/* Roles Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {roles.map((role) => (
        <div
          key={role._id}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden border border-gray-200"
        >
          {/* Role Header */}
          <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {role.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                  title="Edit role"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteRole(role._id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all"
                  title="Delete role"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
  
          {/* Role Permissions */}
          <div className="p-5">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Permissions:
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.permissions.length > 0 ? (
                role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium capitalize transition-colors hover:bg-indigo-100"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">
                  No permissions assigned
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  
    {/* No Roles State */}
    {roles.length === 0 && (
      <div className="text-center py-16">
        <FiShield className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          No roles found
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Start by creating a new role to manage permissions.
        </p>
        <div className="mt-6">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FiUserPlus className="mr-2" />
            Add New Role
          </button>
        </div>
      </div>
    )}
  
    {/* Role Modal */}
    <RoleModal
      showModal={showModal}
      role={currentRole}
      isEditing={isEditing}
      onClose={() => setShowModal(false)}
      onSave={handleSave}
      onRoleChange={handleRoleNameChange}
      onPermissionToggle={togglePermission}
    />
  </div>
  
  );
};

export default RoleManagement;
