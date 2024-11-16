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
          navigate('/dashboard'); // Redirect to dashboard on successful login
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
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="w-96 p-6 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
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
          <button className="btn btn-primary w-full">Login</button>
        </form>
      </div>

      {/* Success and Error Modals */}
      <Modal
        type="success"
        message="Login successful!"
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
      />
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
