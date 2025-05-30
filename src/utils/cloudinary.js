import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from 'fs';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloundinary = async (localfilePath)=>{
    try {
        if(!localfilePath) return null;
        //upload file to cloudinary
        const reponse = await cloudinary.uploader.upload(localfilePath,{
            resource_type:'auto'
        })
        //file has been uploaded successfully
        console.log("File is uploaded successfully to cloudinary",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath); //delete the file from local storage
        return null;
    }
}

export {uploadOnCloundinary};


const uploadResult = await cloudinary.uploader
.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
        public_id: 'shoes',
    }
)
.catch((error) => {
    console.log(error);
});

console.log(uploadResult);