import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../componets/OAuth';
import {toast} from 'react-toastify';
import {getAuth ,sendPasswordResetEmail } from 'firebase/auth';
export default function ForgotPassword() {
const [email, setEmail] = useState(" ");
  
  function onChange(e){
    setEmail(e.target.value);
  }
  async function onSubmit(e){
    e.preventDefault()
    try{
      const auth =getAuth();
      await sendPasswordResetEmail(auth,email);
      toast.success("email was sent");
    }catch (error){
      toast.error("couldnt send reset password");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:md-6'>
          <img src='https://media.istockphoto.com/id/811268074/photo/laptop-computer-desktop-pc-human-hand-office-soft-focus-picture-vintage-concept.jpg?s=612x612&w=is&k=20&c=TdryUCJfxWqCEpnTU9Uqs7_GprlMa4UqoYml4wL_0BU=' alt='key'
            className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>

            <input  type="email" id="email" value={email} onChange={onChange} placeholder='Email address' className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'/>
           
          <div className='flex justify-between white-space-nowrap text-sm sm:text-lg'>
            <p className='mb-6'>Don't have a account? 
              <Link to="/sign-up" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1' >Sign up</Link>
            </p>
            <p>
              <Link to="/sign-in" className='text-blue-600 hover:text-blue-900 transition duration-200 ease-in-out ml-1'>Sign in instead</Link>
            </p>
          </div>
          <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"type="submit"> Send reset password </button>
          <div className='flex my-4  items-center before:border-t  before:flex-1  before:border-gray-300 after:border-t  after:flex-1  after:border-gray-300'>
            <p className='text-center font-semibold mx-4'>OR</p>
          </div>
          <OAuth/>
          </form>
          
        </div>
      </div>
    </section>
  )
}
