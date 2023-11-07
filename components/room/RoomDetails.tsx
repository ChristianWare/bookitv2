"use client";

import StarRatings from "react-star-ratings";
import { IRoom } from "@/backend/models/room";
import RoomImageSlider from "./RoomImageSlider";
import RoomFeatures from "./RoomFeatures";
import BookingDatePicker from "./BookingDatePicker";
import ListReviews from "../review/ListReviews";
import NewReview from "../review/NewReview";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";

interface Props {
  data: {
    room: IRoom;
  };
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const RoomDetails = ({ data }: Props) => {
  const { room } = data;

  useEffect(() => {
    const setMap = async () => {
      const coordinates = room?.location?.coordinates;

      const map = new mapboxgl.Map({
        container: "room-map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 12,
      });

      // Add marker to the map:
      new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    };
    if (room?.location) setMap();
  }, [room?.location]);

  return (
    <div className='container container-fluid'>
      <h2 className='mt-5'>{room?.name}</h2>
      <p>{room.address}</p>

      <div className='ratings mt-auto mb-3'>
        <StarRatings
          rating={room?.ratings}
          starRatedColor='#e61e4d'
          numberOfStars={5}
          starDimension='22px'
          starSpacing='1px'
          name='rating'
        />
        <span className='no-of-reviews'>({room.numOfReviews} Reviews)</span>
      </div>

      <RoomImageSlider images={room?.images} />

      <div className='row my-5'>
        <div className='col-12 col-md-6 col-lg-8'>
          <h3>Description</h3>
          <p>{room?.description}</p>

          <RoomFeatures room={room} />
        </div>

        <div className='col-12 col-md-6 col-lg-4'>
          <div className='mb-4'>
            <BookingDatePicker room={room} />
          </div>

          {/*  Room map to be added  */}

          {room?.location && (
            <div className='my-5'>
              <h4 className='my-2'>Room Location:</h4>
              <div
                id='room-map'
                className='shadow rounded'
                style={{ height: 350, width: "100%" }}
              ></div>
            </div>
          )}
          {/* <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.4805455690466!2d-111.6182358!3d33.4107139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872bb0f7fe6875c5%3A0x94de94ee798d8352!2s230%20S%2098th%20Way%2C%20Mesa%2C%20AZ%2085208!5e0!3m2!1sen!2sus!4v1698700988463!5m2!1sen!2sus'
            width='100%'
            height='450'
            allowFullScreen={true}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            className='shadow rounded'
            style={{ height: 350, width: "100%" }}
          ></iframe> */}
        </div>
      </div>
      <NewReview roomId={room?._id} />
      <ListReviews reviews={room?.reviews} />
    </div>
  );
};
export default RoomDetails;
