import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../config/firebaseconfig';
import { useNavigate } from 'react-router-dom';

const ProtectedRout = ({component}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true)
        } else {
           navigate('/login');
        }
      });
  }, [])
   
    
  return (
    user ? component : <h1>Loading....</h1>
  )
}

export default ProtectedRout