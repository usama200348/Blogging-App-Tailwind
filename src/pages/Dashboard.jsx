import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";
import Modal from "../components/modal";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const title = useRef();
  const description = useRef();
  const [blogs, setBlogs] = useState([]);
  const [userEmails, setUserEmails] = useState({});
  const [editingBlog, setEditingBlog] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success Modal for publishing/updating
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Confirmation Modal for delete
  const [blogToDelete, setBlogToDelete] = useState(null); // To store the blog being deleted
  const [successMessage, setSuccessMessage] = useState(""); // To store success message for the modal
  const user = auth.currentUser;

  // Fetch blogs and user emails
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const blogs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((blog) => blog.uid === user.uid);
      setBlogs(blogs);
      setLoadingEmails(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Add new blog
  const postBlog = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title: title.current.value,
        description: description.current.value,
        uid: user.uid,
        timestamp: serverTimestamp(),
        user: user.email,
      });
      setSuccessMessage("Blog published successfully!"); // Success message for publishing
      setShowSuccessModal(true); // Show success modal after publishing
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
      title.current.value = "";
      description.current.value = "";
    }
  };

  // Handle blog update
  const updateBlog = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const blogRef = doc(db, "blogs", editingBlog.id);
      await updateDoc(blogRef, {
        title: title.current.value,
        description: description.current.value,
      });
      setSuccessMessage("Blog updated successfully!"); // Success message for updating
      setShowSuccessModal(true); // Show success modal after updating
      setEditingBlog(null); // Clear editing state
    } catch (e) {
      console.error("Error updating blog: ", e);
    } finally {
      setLoading(false);
      title.current.value = "";
      description.current.value = "";
    }
  };

  // Handle blog deletion confirmation
  const deleteBlog = async () => {
    try {
      const blogRef = doc(db, "blogs", blogToDelete.id);
      await deleteDoc(blogRef);
      setSuccessMessage("Blog deleted successfully!"); // Success message for deleting
      setShowSuccessModal(true); // Show success modal after deleting
      setShowDeleteConfirmation(false); // Close delete confirmation modal
      console.log("Blog deleted successfully!");
    } catch (e) {
      console.error("Error deleting blog: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Add Blog Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mt-12 h-[400px]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingBlog ? "Edit Blog" : "Add a New Blog"}
          </h2>
          <form onSubmit={editingBlog ? updateBlog : postBlog}>
            <input
              type="text"
              placeholder="Enter blog title"
              ref={title}
              defaultValue={editingBlog ? editingBlog.title : ""}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Enter blog content"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              rows="5"
              ref={description}
              defaultValue={editingBlog ? editingBlog.description : ""}
              required
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : editingBlog ? (
                "Update Blog"
              ) : (
                "Publish Blog"
              )}
            </button>
          </form>
        </div>

        {/* Blogs List Section */}
        <div className="overflow-y-auto h-[400px] bg-white p-8 mt-12 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 ">
            Your Blogs
          </h2>
          {blogs.length === 0 ? (
            <p>No blogs found. Start by adding one!</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-medium text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 mt-2 mb-4">{blog.description}</p>
                <p className="text-gray-400 text-sm">
                  Published by: {userEmails[blog.uid] || user.email}{" "}
                  - {blog.timestamp?.toDate().toLocaleString()}
                </p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      title.current.value = blog.title;
                      description.current.value = blog.description;
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setBlogToDelete(blog); // Set blog to be deleted
                      setShowDeleteConfirmation(true); // Show delete confirmation modal
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        type="success"
        message={successMessage} // Display the success message dynamically
        isOpen={showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        type="warning"
        message="Are you sure you want to delete this blog?"
        isOpen={showDeleteConfirmation}
        confirmAction={deleteBlog}
        confirmText="Yes"
        cancelText="No"
        closeModal={() => setShowDeleteConfirmation(false)}
      />
    </div>
  );
};

export default Dashboard;




