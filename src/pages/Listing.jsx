import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoShareSocialSharp } from "react-icons/io5";
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Listing() {
  const { listingId } = useParams();
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
    </main>
  );
}
