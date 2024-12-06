import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React from 'react'
import {FaGoogle} from "react-icons/fa"
import {toast} from 'react-toastify'
import {getAuth} from "firebase/auth";
import { getDoc, serverTimestamp } from 'firebase/firestore';
import {db} from '../firebase';
import {doc,setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router';
export default function OAuth() {
  const navigate=useNavigate()
  async function onGoogleClick(){
    try{
      const auth =getAuth()
      const provider =new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user =result.user
      const docR = doc(db, "users", user.uid)
      const snap =await getDoc(docR)
      if(!snap.exists()){
        await setDoc(docR,{
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }navigate("/")
    }catch(error){
      toast.error("couldnt authorize")
      console.log(error);
    }
  }
  return (
    <button type="button" onClick={onGoogleClick} className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded'>
      <FaGoogle className='text-2xl mr-2' />
      Continue with Google
      </button>
  )
}
