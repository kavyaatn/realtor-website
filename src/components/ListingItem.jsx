import React from 'react'
import Moment from 'react-moment'
import {Link} from 'react-router-dom'
import { FaLocationDot } from "react-icons/fa6";
export default function ListingItem({listing, id}) {
  return (<li className=' realative bg-white-500 flex-col justify-between items-center shadow-md hover"shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
    <Link className="contents" to={`/category/${listing.type}/${id}`}>
      <img className="h-[170px] w-full object-cover hover:scale-150 transition-scale duration-100 ease-in" loading="lazy"src={listing.imgUrls[0]} alt=""/>
      <Moment className='absolute top-2 left-2 bg-[#6615cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'fromNow>
        {listing.timestamp.toDate()}
      </Moment>
      <div className='w-full p-[10px] '>
        <div className='flex items-center space-x-1'>
          <FaLocationDot className='h-4 w-4 text-blue-300'/>
          <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
        </div>
        <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
        <p className='text-blue-900 mt-2 font-semibold'>
  ${listing.offer 
    ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
    : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  {listing.type === "rent" && " / month"}
</p>
        <div className='flex items-center mt-[10px] space-x-3'>
          <div className='flex items-center space-x-1'>
            <p className='font-bold text-xs'>
              {listing.bedrooms > 1? `${listing.bedrooms} Beds` : "1 Bed"}
            </p>
          </div>
          <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
        </div>
      </div>
    </Link>
  </li>
  );
}
