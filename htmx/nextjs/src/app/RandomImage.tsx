import Image from "next/image";

const images = [
  "https://www.slc.gov/parks/wp-content/uploads/sites/17/2018/01/citycreek.jpg",
  "https://res.cloudinary.com/simpleview/image/upload/v1519428997/clients/saltlake/5873818AE414E41A87362D5233C57D00_b4ed1fd0-7ca4-484b-9327-6ed047d4517d.jpg",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/63/3c/8d/memory-grove-park.jpg?w=500&h=500&s=1",
  "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/saltlake/City-Creek-Park-e73d67815056a36_e73d69b3-5056-a36a-067421a1ff793331.jpg",
];

export default function RandomImage(props: { className: string }) {
  const imgIndex = Math.floor(Math.random() * images.length);
  return <img src={images[imgIndex]} alt="temp" className={props.className} />;
}
