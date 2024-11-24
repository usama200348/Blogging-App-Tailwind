import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";
import Modal from "../components/modal";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const user = auth.currentUser;

  const titleRef = useRef();
  const descriptionRef = useRef();

  // Fetch blogs
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((blog) => blog.uid === user.uid);
      setBlogs(blogsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const blogData = {
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      uid: user.uid,
      timestamp: serverTimestamp(),
    };

    try {
      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
        setSuccessMessage("Blog updated successfully!");
      } else {
        await addDoc(collection(db, "blogs"), blogData);
        setSuccessMessage("Blog published successfully!");
      }
      setShowSuccessModal(true);
      setEditingBlog(null);
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
      titleRef.current.value = "";
      descriptionRef.current.value = "";
    }
  };

  const deleteBlog = async () => {
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete.id));
      setSuccessMessage("Blog deleted successfully!");
      setShowSuccessModal(true);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-20 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Blog Dashboard
      </h1>

      <div className="flex flex-col items-center space-y-6 w-full max-w-xl">
        <BlogForm
          loading={loading}
          handleBlogSubmit={handleBlogSubmit}
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          editingBlog={editingBlog}
        />

        {/* Blogs List Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-auto w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Blogs
          </h2>
          {blogs.length === 0 ? (
            <p className="text-gray-500">No blogs found. Start by adding one!</p>
          ) : (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                setEditingBlog={setEditingBlog}
                setBlogToDelete={setBlogToDelete}
                setShowDeleteConfirmation={setShowDeleteConfirmation}
              />
            ))
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        type="success"
        message={successMessage}
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

// Blog Form Component
const BlogForm = ({
  loading,
  handleBlogSubmit,
  titleRef,
  descriptionRef,
  editingBlog,
}) => (
  <div className="bg-white shadow-md rounded-lg p-6 w-full">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      {editingBlog ? "Edit Blog" : "Add a New Blog"}
    </h2>
    <form onSubmit={handleBlogSubmit}>
      <input
        type="text"
        placeholder="Enter blog title"
        ref={titleRef}
        defaultValue={editingBlog ? editingBlog.title : ""}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-600"
        required
      />
      <textarea
        placeholder="Enter blog content"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-white text-gray-500"
        rows="4"
        ref={descriptionRef}
        defaultValue={editingBlog ? editingBlog.description : ""}
        required
      />
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        disabled={loading}
      >
        {loading ? "Loading..." : editingBlog ? "Update Blog" : "Publish Blog"}
      </button>
    </form>
  </div>
);

// Blog Card Component
const BlogCard = ({
  blog,
  setEditingBlog,
  setBlogToDelete,
  setShowDeleteConfirmation,
}) => (
  <div className="bg-gray-50 shadow-md rounded-lg p-4 mb-4">
    <h3 className="text-lg font-medium text-gray-800">{blog.title}</h3>
    <p className="text-gray-600 mt-2 mb-3">{blog.description}</p>
    <p className="text-gray-400 text-sm">
      Published on: {blog.timestamp?.toDate().toLocaleString()}
    </p>
    <div className="mt-3 flex space-x-3">
      <button
        onClick={() => setEditingBlog(blog)}
        className="text-blue-500 hover:text-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => {
          setBlogToDelete(blog);
          setShowDeleteConfirmation(true);
        }}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  </div>
);

export default Dashboard;
