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
        console.log("Fetching blogs for UID:", uid); // Debugging log

        // Query Firestore to get blogs for the specific user
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

          console.log("Fetched Blogs:", userBlogsData); // Debugging log

          setUserBlogs(userBlogsData);

          // Set user email from the first blog
          setUserEmail(userBlogsData[0].user || "Unknown");
        } else {
          console.log("No blogs found for this UID"); // Debugging log
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
    <div className="py-8 px-8 bg-gray-100 pt-28 h-screen">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Blogs By:
          <span className="text-blue-600 text-lg font-medium px-2 py-1 bg-blue-100 rounded-md ml-2">
            {userEmail}
          </span>
        </h1>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loading loading-spinner loading-lg bg-primary"></div>
        </div>
      ) : (
        <div className="overflow-y-auto h-96 container mx-auto border bg-white rounded-lg shadow-md">
          <div className="flex flex-col gap-4 p-4">
            {userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4">{blog.description}</p>
                <p className="text-gray-600 text-sm mb-2">
                  Published by: {blog.user || "Unknown"}
                </p>
                <p className="text-gray-600 text-sm">
                  <span>Date: </span>
                  {blog.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Singleuser;
