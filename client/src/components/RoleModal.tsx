import React from "react";
import { Role } from "../types";

interface RoleModalProps {
  showModal: boolean;
  role: Omit<Role, "_id"> & { _id?: string }; 
  isEditing: boolean; 
  onClose: () => void;
  onSave: () => void;
  onRoleChange: (name: string) => void;
  onPermissionToggle: (permission: string) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  showModal,
  role,
  isEditing,
  onClose,
  onSave,
  onRoleChange,
  onPermissionToggle,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-y-auto">
  <div className="relative w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    {/* Modal Header */}
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800">
        {isEditing ? "Edit Role" : "Add New Role"}
      </h3>
    </div>

    {/* Role Name Input */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Role Name
      </label>
      <input
        type="text"
        placeholder="Enter role name"
        className={`w-full px-4 py-2 border ${
          isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        value={role.name}
        onChange={(e) => onRoleChange(e.target.value)}
        disabled={isEditing}
      />
    </div>

    {/* Permissions Section */}
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Permissions</h4>
      <div className="space-y-3">
        {["read", "write", "delete"].map((permission) => (
          <label
            key={permission}
            className="flex items-center text-sm text-gray-600"
          >
            <input
              type="checkbox"
              checked={role.permissions.includes(permission)}
              onChange={() => onPermissionToggle(permission)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 capitalize">{permission}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex items-center justify-end gap-4">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isEditing ? "Save Changes" : "Add Role"}
      </button>
    </div>
  </div>
</div>

  );
};

export default RoleModal;
