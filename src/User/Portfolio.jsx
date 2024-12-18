import React, { useState } from 'react'
import '../styel.css';
import ImageUploadForm from './ImageUploadForm';
import ImageGallery from './ImageGallery';

export default function Portfolio({fetchImages}) {
  const [openimageuplaodfrom,setOpenImageuplaodfrom] = useState(false);
  const loadform = ()=>setOpenImageuplaodfrom(true)
  const openImageuploadform =()=>{
    setOpenImageuplaodfrom(false);
    fetchImages();
  }
  return (
    <div>
      <section id="Portfolio" class="Portfolio">
          <div class="container">
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" onClick={loadform} height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480ZM213.83-108.65q-43.63 0-74.41-30.77-30.77-30.78-30.77-74.41v-532.34q0-43.63 30.77-74.41 30.78-30.77 74.41-30.77h318.5v105.18h-318.5v532.34h532.34v-318.5h105.18v318.5q0 43.63-30.77 74.41-30.78 30.77-74.41 30.77H213.83Zm34.8-165.74h462.74L553.76-485.04 444-337.76l-73.76-97.76-121.61 161.13Zm430.33-329.94v-74.63h-74.63v-97.76h74.63v-74.63h97.76v74.63h74.63v97.76h-74.63v74.63h-97.76Z"/></svg>
             {
                openimageuplaodfrom && <ImageUploadForm openImageuploadform={openImageuploadform}></ImageUploadForm>
             }
             <ImageGallery  ></ImageGallery>
             </div>
          </div>
      </section>
     </div>
  )
}
