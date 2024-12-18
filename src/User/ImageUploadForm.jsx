import React, { useState } from 'react';
import axios from 'axios';
const ImageUploadForm = ({openImageuploadform}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const username =localStorage.getItem('username');
    console.log(`username from local store :$1`,[username]);
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('username', username);
        try {
            const response = await axios.post('http://localhost:5000/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            openImageuploadform();            
        } catch (error) {
            alert('Error uploading image');
        }
    };

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-content-Editprofile">
                    <span className="close-btn" onClick={openImageuploadform}>&times;</span>
                    <h4>Add Image</h4>
                    <div className="container mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="imageUpload">Choose an image:</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {previewImage && (
                                <div className="mt-3">
                                    <h5>Image Preview:</h5>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="img-thumbnail"
                                        style={{ maxHeight: '300px', maxWidth: '100%' }}
                                    />
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary mt-3">
                                Upload Image
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
       
    );
};

export default ImageUploadForm;
