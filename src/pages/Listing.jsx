import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoShareSocialSharp } from "react-icons/io5";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FaBed, FaBath,FaParking, FaChair} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'

export default function Listing() {
  const { listingId } = useParams();
  const auth = getAuth();
  const [contacting, setContacting] =useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setshareLink]  = useState(false);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
      }
      setLoading(false);
    }
    fetchListing();
  }, [listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: 'progressbar' }}
        effect="fade"
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[10%] right-[3%] z-10 bg-white cursor-pointer rounded-full w-10 h-10 flex justify-center items-center' onClick={()=>{
        navigator.clipboard.writeText(window.location.href); setshareLink(true); setTimeout(()=>{setshareLink(false);},2000);
      }}>
              <IoShareSocialSharp className="text-2xl "/>
      </div>
      {shareLink &&(
        <p className='fixed top-[15%] right-[3%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'> Link Copied</p>
      )}
      <div className='flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg border-3 shadow-lg bg-white lg:space-x-5 '>
        <div className=' w-full'>
            <p className='text-2xl font-bold mb-3 text-blue-900'>
                {listing.name} - ${listing.offer? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" ? "/ month" : ""}
            </p>
            <p className='flex items-center mt-6 mb-6 font-semibold'>
                <FaLocationDot className='text-green-600 mr-1'/>
                {listing.address}</p>
            <div className='flex justify-start items-center space-x-4 w-[75%]'>
              <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>{listing.type === "rent" ? "For Rent" : "For Sale"} </p>
              {listing.offer &&(<p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md '>
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>)}
            </div>
            <p className='mt-4 mb-2'>
              <span className='mt-3 font-semibold'>
              Description - {listing.description}
                </span>
            </p>
            <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-6'>
              <li className='flex items-center whitespace-nowrap'>
                <FaBed className='text-lg mr-1'/>
                {listing.bedrooms >1 ? `${listing.bedrooms} Beds`: "1 Bed"}
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaBath className='text-lg mr-1'/>
                {listing.bathrooms >1 ? `${listing.bathrooms} Baths`: "1 Bath"}
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaParking className='text-lg mr-1'/>
                {listing.parking ? "Parking Spot" :"No Parking"}
              </li>
              <li className='flex items-center whitespace-nowrap'>
                <FaChair className='text-lg mr-1'/>
                {listing.furnished ? "Furnished" :"Not Furnished"}
              </li>
            </ul>
            {listing.userRef!== auth.currentUser?.uid && !contacting && (
            <div className='mt-6'>
            <button onClick={()=> setContacting(true)} className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 focus:shadow-lg w-full text-center transition duration-150 ease-in-out">Contact Landlord</button>
            </div>
            )}
            {contacting && <Contact userRef={listing.userRef} listing={listing}/>}
        </div>
        <div className='w-full h-[200px] md:h-[600px] z-10 overflow-hidden mt-6 md:mt-0 md:ml-2'>
        <MapContainer center={[listing.geoLocation.lat,listing.geoLocation.long]} zoom={13} scrollWheelZoom={false} style={{width: "100%", height: "100%"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
      <Marker position={[listing.geoLocation.lat,listing.geoLocation.long]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>

        </div>
      </div>
    </main>
  );
}
