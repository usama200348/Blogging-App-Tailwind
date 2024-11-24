import React, { useRef, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/modal';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1500);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        setIsErrorModalOpen(true);
      });

    email.current.value = '';
    password.current.value = '';
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {/* Login Container */}
      <div className="w-96 p-8 shadow-xl rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-6 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={password}
            required
          />
          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        type="success"
        message="Login successful!"
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
      />
      {/* Error Modal */}
      <Modal
        type="error"
        message={'Invalid credentials!'}
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
      />
    </div>
  );
};

export default Login;
