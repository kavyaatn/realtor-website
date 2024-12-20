import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from "../firebase";
import { doc, getDocs, orderBy, query, updateDoc, collection, where } from "firebase/firestore"; 
import { FaHome } from "react-icons/fa";
import ListingItem from '../components/ListingItem';

export default function Profile() {
  const auth = getAuth();
  const [listing, setListing] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName || '', // Ensure a default value
    email: auth.currentUser.email || '',
  });
  const [changeDetails, setChangeDetails] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      const { name } = formData; // Get name from formData
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success('Profile details updated');
    } catch (error) {
      toast.error("Could not update profile details");
    }
  }

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    async function fetchingUserListing() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("useRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing(listings); // Set listings state
      setLoading(false);
    }

    fetchingUserListing();
  }, [auth.currentUser.uid]);

  return (
    <div className='w-full md:w-[50%] mt-6 px-3'>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div>
          <form>
            <input 
              type="text" 
              id="name" 
              value={formData.name} 
              disabled={!changeDetails} 
              onChange={onChange} 
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetails ? "bg-red-200 focus:bg-red-200" : ""}`} 
            />
            <input 
              type="email" 
              id="email" 
              value={formData.email} 
              disabled 
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out" 
            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'> 
              <p className='flex items-center'> 
                Do you want to change your name?
                <span 
                  onClick={() => { 
                    if (changeDetails) onSubmit(); 
                    setChangeDetails((prevState) => !prevState); 
                  }} 
                  className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
                  {changeDetails ? "apply change" : "Edit"}
                </span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'> Sign Out</p>
            </div>
          </form>
          <button type='button' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-small font-medium rounded shadow-md hover:bg-blue-750 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-900'>
            <Link to="/create-listing" className='flex justify-center items-center'>
              <FaHome className='mr-2 text-2xl bg-blue-100 rounded-full p-1 border-2' />
              Sell or rent your Home
            </Link>
          </button>
        </div>
      </section>
      <div>
        {!loading && listing.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold'> Listings </h2>
            <ul>
              {listing.map((item) => (
                <ListingItem
                  key={item.id}
                  id={item.id}
                  listing={item.data} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
