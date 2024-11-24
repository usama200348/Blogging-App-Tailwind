import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../config/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/modal';

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );

      // Set the displayName for the user
      await updateProfile(userCredential.user, {
        displayName: username.current.value, 
      });

      console.log(userCredential.user);
      setIsSuccessModalOpen(true);

      
      await signOut(auth);

      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage); 
      setIsErrorModalOpen(true);
    }

    username.current.value = '';
    email.current.value = '';
    password.current.value = '';
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-96 p-8 shadow-xl bg-white rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full mb-5 px-4 py-3 rounded-lg bg-blue-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            ref={username}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-5 px-4 py-3 rounded-lg bg-blue-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            ref={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-6 px-4 py-3 rounded-lg bg-blue-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            ref={password}
            required
          />
          <button className="btn btn-primary w-full py-3 rounded-lg text-white font-semibold hover:bg-blue-600 transition duration-200 ease-in-out">
            Register
          </button>
        </form>
      </div>

      <Modal
        type="success"
        message="Registration successful!"
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
      />
      <Modal
        type="error"
        message={'Something went wrong! Please try again.'}
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
      />
    </div>
  );
};

export default Register;
