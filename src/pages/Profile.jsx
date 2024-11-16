import React, { useState, useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseconfig.js"; // Assuming firebase.js is in the same folder
import Modal from "../components/modal"; // Assuming you have a reusable Modal component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Extract username from email (before the '@')
  const getUsernameFromEmail = (email) => {
    return email.split("@")[0];
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Refresh the user to get the latest profile data
        await firebaseUser.reload();
        setUser(auth.currentUser);
        setNewUsername(firebaseUser.displayName || getUsernameFromEmail(firebaseUser.email));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: newUsername,
        });
        // Reload the user profile to get the latest changes
        await user.reload();
        setUser(auth.currentUser);
        setIsEditing(false);
        setShowSuccessModal(true); // Show success modal
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen pt-10">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md"
          />
        </div>
        {/* User Name */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          {isEditing ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border-2 border-gray-300 rounded p-2"
            />
          ) : (
            user.displayName || getUsernameFromEmail(user.email)
          )}
        </h2>
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
                className="border-2 border-gray-300 rounded p-2"
              />
            ) : (
              user.displayName || getUsernameFromEmail(user.email)
            )}
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Joined:</span>
            <span>{user.metadata.creationTime || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-between float-end">
          {isEditing ? (
            <button
              className="btn btn-primary w-28"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="btn btn-primary w-28 "
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
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
