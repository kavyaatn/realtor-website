import React, { useEffect,useState } from 'react'
import {toast} from 'react-toastify'
import {db} from '../firebase'
import {collection, orderBy, query, where, limit, getDocs, startAfter} from 'firebase/firestore'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
export default function Offers() {
  const [listings,setListings] =useState(null)
  const[loading,setLoading] =useState(true)
  const [newlist, setNewList] = useState(null)
  useEffect(()=>{
    async function fetchListings(){
      try{
        const listingRef = collection(db, 'listings')
        const q=query(listingRef,where('offer','==', true), orderBy('timestamp','desc'),limit(8));
        const qSnap = await getDocs(q);
        const lastVisible = qSnap.docs[qSnap.docs.length -1]
        setNewList(lastVisible);
        const listings=[];
        qSnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      }catch(error){
        toast.error('could not fetch listing');
      }
    }
    fetchListings();
  },[]);
  async function onMoreListing() {
    try{
      const listingRef = collection(db, 'listings')
      const q=query(listingRef,where('offer','==', true), orderBy('timestamp','desc'),startAfter(newlist),limit(8));
      const qSnap = await getDocs(q);
      const listings=[];
      qSnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings((prevState)=>[...prevState,
        ...listings]);
      setLoading(false)
    }catch(error){
      toast.error('could not fetch listing');
    }
  };
  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 mb-6 font-bold'>Offers</h1>
      {loading ? (
        <Spinner/>
      ) : listings && listings.length > 0 ?(
        <>
        <main>
          <ul className='sm:grid sm:gris-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {listings.map((listing)=>(
              <ListingItem key={listing.id} id={listing.id}
              listing={listing.data}/>
            ))}
          </ul>
        </main>
        {newlist &&(
          <div className='flex justify-center items-center'>
            <button onClick={onMoreListing} className='bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>Load More</button>
          </div>
        )}
        </>
      ):(<p> There are no offers currently</p>)}
    </div>
  )
}
