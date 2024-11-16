import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";

const Singleuser = () => {
  const { id: uid } = useParams();
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "blogs"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        const userBlogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().timestamp
            ? doc.data().timestamp.toDate().toLocaleDateString()
            : "No date",
        }));
        setUserBlogs(userBlogsData);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [uid]);

  return (
    <div className="py-8 px-8 bg-gray-100 pt-28 h-screen overflow-hidden">
      <div className="flex justify-center">
      <h2 className="max-w-80 text-1xl font-semibold text-gray-800 mb-6 text-center p-6 bg-white rounded-lg shadow-md">
        All blogs by :
        <span className="text-blue-600 text-lg font-medium px-2 py-1 rounded-md">
          {user.email}
        </span>
      </h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <div className="overflow-auto h-full container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-700 mb-4">{blog.description}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    Published by : {user.email || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span>Date : </span>
                    {blog.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Singleuser;
