import React from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

const Modal = ({
  type = "info",
  message,
  isOpen,
  closeModal,
  confirmAction,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  // Determine the icon and colors based on the modal type
  let icon, iconColor, headerText;
  if (type === "success") {
    icon = <FaCheckCircle size={24} />;
    iconColor = "text-green-500";
    headerText = "Success!";
  } else if (type === "warning") {
    icon = <FaExclamationCircle size={24} />;
    iconColor = "text-yellow-500";
    headerText = "Warning!";
  } else if (type === "error") {
    icon = <FaTimesCircle size={24} />;
    iconColor = "text-red-500";
    headerText = "Error!";
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-5 rounded-lg shadow-md w-96 relative">
        <div className={`flex items-center gap-3 ${iconColor}`}>
          <span>{icon}</span>
          <h3 className="text-lg font-semibold">{headerText}</h3>
        </div>
        <p className="text-gray-700 my-4">{message}</p>
        <div className="flex justify-end gap-3">
          {confirmAction && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              onClick={confirmAction}
            >
              {confirmText}
            </button>
          )}
          {closeModal && (
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
              onClick={closeModal}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
