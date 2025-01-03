import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider';
import { db } from '../firebase';
import {Link} from 'react-router-dom';
import { collection, doc, query, where ,orderBy,limit,getDocs  } from 'firebase/firestore';
import  ListingItem  from '../components/ListingItem'
export default function Home() {
  //Ofers
  const [offerListings, setOfferListings] = useState(null)
  useEffect(()=>{
    async function fetchListings(){
      try {
        // get reference
        const listingRef = collection(db,'listings')
        const q = query(listingRef, where('offer','==', true),orderBy("timestamp","desc"),limit(4));
        const querySnap = await getDocs(q)
        const listings =[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data(),
          });
        });
        setOfferListings(listings)
        //console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings()
  },[]);
  //Places rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        // get reference
        const listingRef = collection(db,'listings');
        const q = query(listingRef, where('type','==', "rent"),orderBy("timestamp","desc"),limit(4));
        const querySnap = await getDocs(q)
        const listings =[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data(),
          });
        });
        setRentListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  },[]);
  //Places sale
  const [saleListings, setSaleListings] = useState(null);
  useEffect(()=>{
    async function fetchListings(){
      try {
        // get reference
        const listingRef = collection(db,'listings');
        const q = query(listingRef, where('type','==', "sale"),orderBy("timestamp","desc"),limit(4));
        const querySnap = await getDocs(q)
        const listings =[];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data(),
          });
        });
        setSaleListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  },[]);
  return (
    <div>
      <Slider />
      <div className='max-w-6xl mx-auto pt-4 space-y-6 '>
        {offerListings && offerListings.length > 0 &&(
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent Offers</h2>
            <Link to="/offers">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out '> Show more Offers</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {offerListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 &&(
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for rent</h2>
            <Link to="/category/rent">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out '> Show more places for rent</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {offerListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}
        {saleListings && saleListings.length > 0 &&(
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for sale</h2>
            <Link to="/category/sale">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out '> Show more places for rent</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {saleListings.map((listing)=>(
                <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
