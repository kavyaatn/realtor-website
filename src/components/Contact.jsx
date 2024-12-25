import { doc ,getDoc} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { toast } from 'react-toastify';

export default function Contact({userRef,listing}) {
    const [landlord, SetLandlord]= useState(null);
    const [message, setMessage] = useState("");
    useEffect(() =>{
        async function getLLord(){
            const docRef =doc (db, 'users',userRef)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                SetLandlord(docSnap.data());
            }else{
                toast.error("could not get landlord data");
            }
        }getLLord();
    },[userRef]);
    function onChange(e){
        setMessage(e.target.value);
    }
  return (
    <>
      {landlord !==null && (
        <div className='flex flex-col w-full'>
            <p>
                Contact {landlord.name} for the {listing.name.toString().toLowerCase()}
            </p>
            <div className='mt-3 mb-6'>
                <textarea name="message" rows="2" value={message} onChange={onChange} className='w-full px-4 text-xl text-gray-700 bg-white-500 border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'></textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                <button type="button" className='px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 foucs:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out w-full text-center mb-6'>Send Message</button>
            </a>
        </div>
      )
      }
    </>
  );
}
