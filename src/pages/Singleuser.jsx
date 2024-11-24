import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseconfig";

const Singleuser = () => {
  const { id: uid } = useParams();
  const [userBlogs, setUserBlogs] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "blogs"),
          where("uid", "==", uid),
          orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userBlogsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().timestamp
              ? doc.data().timestamp.toDate().toLocaleDateString()
              : "No date",
          }));
          setUserBlogs(userBlogsData);
          setUserEmail(userBlogsData[0].user || "Unknown");
        } else {
          setUserEmail("No Blogs Found");
          setUserBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching user blogs:", error);
        setUserEmail("Error Fetching Email");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [uid]);

  return (
    <div className="py-8 px-6 bg-gradient-to-b from-gray-50 to-white min-h-screen pt-28">
      {/* Title Section */}
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Blogs by:
          <span className="text-blue-600 text-xl font-medium bg-blue-100 py-1 px-3 rounded-lg ml-3">
            {userEmail}
          </span>
        </h1>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
        </div>
      ) : userBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m2 4H7m2-8h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-semibold mb-4">
            No blogs found for this user.
          </p>
        </div>
      ) : (
        <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {blog.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                <div className="text-gray-500 text-sm mb-2">
                  <p>
                    <strong>Published by:</strong> {blog.user || "Unknown"}
                  </p>
                  <p>
                    <strong>Date:</strong> {blog.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Singleuser;
