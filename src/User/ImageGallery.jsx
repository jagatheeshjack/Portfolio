import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styel.css';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const user = localStorage.getItem('username');
    
    console.log('Username from localStorage:', user); // Debugging line

    useEffect(() => {
        const fetchImages = async () => {
            try {
                console.log('Fetching images for user:', user); // Debugging line before API call
                const response = await axios.get(`http://localhost:5000/api/getimages/${user}`); // Use full URL
                console.log('Response data:', response.data); // Debugging line for API response
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error); // Log the error if API call fails
            }
        };

        if (user) {
            fetchImages();
        } else {
            console.warn('No user found in localStorage.'); // Debugging line for missing user
        }
    }, [user]);

    useEffect(() => {
        console.log('Images state updated:', images);
    }, [images]);

    return (
        <div className="container">
            <h2 className="text-center my-4">Image Gallery</h2>
            <div className="row">
                {images.length === 0 ? (
                    <div className="col-12 text-center">
                        <p>No images found for this user.</p> {/* Message for no images */}
                    </div>
                ) : (
                    images.map((image, index) => 
                        (
                            <div className="col">
                                <div className='imagecontainer'>
                                    <img src={`data:image/png;base64,${image.image_path}`} className="img-fluid" alt=""/>
                                    <div className="portfolio-links">
                                    <a  data-gallery="portfolioGallery" className="portfolio-lightbox" title="App 1"><i class="bx bx-plus"></i></a>
                                    <a href="portfolio-details.html" title="More Details"><i className="bx bx-link"></i></a>
                                    </div>
                                </div>
                            </div>
                    ))

                )}
            </div>
        </div>
    );
};

export default ImageGallery;
