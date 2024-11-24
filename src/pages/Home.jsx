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
        const blogQuery = query(
          collection(db, 'blogs'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const blogSnapshot = await getDocs(blogQuery);
        const blogsData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().timestamp
            ? doc.data().timestamp.toDate().toLocaleString()
            : 'No date',
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleShowMoreBlogs = (uid) => {
    navigate(`/single-user/${uid}`);
  };

  return (
    <div className="py-8 px-8 bg-gradient-to-b from-blue-50 to-white min-h-screen pt-28">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="loading loading-spinner text-blue-600 loading-lg"></div>
        </div>
      ) : blogs.length === 0 ? (
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
            No blogs here yet.
          </p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate('/dashboard')}
          >
            Be the first to post!
          </button>
        </div>
      ) : (
        <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {blog.title}
                </h2>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {blog.description}
                </p>
                <div className="text-gray-500 text-sm mb-2">
                  <p>
                    <strong>Author:</strong> {blog.user || 'Unknown'}
                  </p>
                  <p>
                    <strong>Date:</strong> {blog.date}
                  </p>
                </div>
                <button
                  onClick={() => handleShowMoreBlogs(blog.uid)}
                  className="text-blue-500 font-semibold hover:text-blue-700 transition"
                >
                  Show more →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
