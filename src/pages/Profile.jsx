import React, { useState, useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseconfig.js";
import usama from './usamaLik.jpeg'
import Modal from "../components/modal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getUsernameFromEmail = (email) => email.split("@")[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        setUser(auth.currentUser);
        setNewUsername(firebaseUser.displayName || getUsernameFromEmail(firebaseUser.email));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName: newUsername });
        await user.reload();
        setUser(auth.currentUser);
        setIsEditing(false);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        Please log in to view your profile
      </div>
    );
  }

  return (
    <div className="min-h-screen   flex justify-center items-center py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={usama}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-lg"
          />
        </div>

        {/* User Name */}
        {/* <h2 className="text-center text-3xl font-semibold text-[#fff] mb-2">
          {isEditing ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            user.displayName || getUsernameFromEmail(user.email)
          )}
        </h2> */}

        {/* Email */}
        <p className="text-center text-gray-600 mb-4">{user.email}</p>

        {/* User Details */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Username:</span>
            {isEditing ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border bg-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              user.displayName || getUsernameFromEmail(user.email)
            )}
          </div>
          <div className="flex justify-between text-gray-700">
            {/* <span className="font-medium">Joined:</span> */}
            {/* <span>{user.metadata.creationTime || "N/A"}</span> */}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          {isEditing ? (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

     
      <Modal
        type="success"
        message="Username saved successfully!"
        isOpen={showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Profile;
