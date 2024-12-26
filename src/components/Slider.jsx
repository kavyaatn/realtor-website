import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router';

export default function Slider() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      const listRef = collection(db, 'listings');
      const q = query(listRef, orderBy('timestamp', 'desc'), limit(5));
      const listSnap = await getDocs(q);
      let listings = [];
      listSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <Swiper
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          navigation
          pagination={{ type:"progressbar",clickable: true }}
          autoplay={{ delay: 3000 }}
          effect="fade"
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="relative w-full h-[300px] overflow-hidden"
              ></div>
              <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#5f35ac] shadow-lg opacity-90 p-2 rounded-br-3xl'>{data.name}</p>
              <p className='text-[#f1faee] absolute left-1 bottom-3 font-medium max-w-[90%] bg-[#980c0c] shadow-lg opacity-90 p-2 rounded-br-3xl'>${data.discountedPrice?? data.regularPrice}{data.type === "rent" && " /month"}</p>

            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
