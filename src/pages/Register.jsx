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
        displayName: username.current.value, // This sets the username
      });

      console.log(userCredential.user);
      setIsSuccessModalOpen(true);
      
      // Sign out the user after registration to prevent auto-login
      await signOut(auth);

      setTimeout(() => {
        navigate('/login'); // Redirect to login after registration
      }, 1500);

    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage); // Display any errors
      setIsErrorModalOpen(true);
    }

    // Reset form values
    username.current.value = '';
    email.current.value = '';
    password.current.value = '';
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full mb-4"
            ref={username}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-4"
            ref={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-6"
            ref={password}
            required
          />
          <button className="btn btn-primary w-full">Register</button>
        </form>
      </div>

      {/* Success and Error Modals */}
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
