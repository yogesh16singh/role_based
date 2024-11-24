import React from "react";
import { Role, User } from "../types";
import { userSchema, UserFormData } from "../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserModalProps {
  showModal: boolean;
  user: Omit<User, "_id"> & { _id?: string };
  roles: Role[];
  isEditing: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  showModal,
  user,
  roles,
  isEditing,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  React.useEffect(() => {
    if (showModal) {
      reset(user);
    }
  }, [showModal, user, reset]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="relative w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {isEditing ? "Edit User" : "Add New User"}
        </h3>
      </div>
  
      {/* Form Section */}
      <form onSubmit={handleSubmit(onSave)} className="mt-6 space-y-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.name.message}
            </p>
          )}
        </div>
  
        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.email.message}
            </p>
          )}
        </div>
  
        {/* Role Selection */}
        <div>
          <select
            {...register("role")}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              errors.role ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
            }`}
            defaultValue={roles[0]?.name}
          >
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.role.message}
            </p>
          )}
        </div>
  
        {/* Status Selection */}
        <div>
          <select
            {...register("status")}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
              errors.status ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
            }`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1 text-left">
              {errors.status.message}
            </p>
          )}
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? "Save Changes" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default UserModal;
