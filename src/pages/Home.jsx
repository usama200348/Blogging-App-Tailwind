import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Fetch blogs from the 'blogs' collection, ordered by timestamp
        const blogQuery = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'), limit(10));
        const blogSnapshot = await getDocs(blogQuery);
        const blogsData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString() : 'No date',
        }));
        setBlogs(blogsData); // Update state with fetched blogs
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchBlogs();
  }, []);

  const handleShowMoreBlogs = (uid) => {
    navigate(`/single-user/${uid}`);
  };

  return (
    <div className="py-8 px-8 bg-gray-100 pt-28 h-screen overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="loading loading-spinner text-primary loading-lg"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600 text-lg font-semibold">
            No blogs here yet. <br />
            <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>
              Log in and be the first to post a blog!
            </span>
          </p>
        </div>
      ) : (
        <div className="overflow-auto h-full container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-700 mb-4">{blog.description}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    Published by: {blog.user || 'Unknown'}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <span>Date: </span>
                    {blog.date}
                  </p>
                  <button
                    onClick={() => handleShowMoreBlogs(blog.uid)}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                  >
                    Show more blogs by this author
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
