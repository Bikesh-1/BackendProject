import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js';
import { response } from 'express';

const registerUser = asyncHandler( async(req,res) =>{
    //get user details from frontend
    //validation - not empty 
    //check if user already exists 
    //check for imagges , check for avatar
    //upload them to cloudinary,avatar
    //create user object - creatte entry in db
    //remove password and refresg token field from response
    //check for user creation 
    //return res

    const {fullName,email,username,password} = req.body 
    console.log("Email",email);

    if (
        [fullName,email,username,password].some((field)=> field?.trim()==="")
    ) {
        throw new ApiError(400,"All field  is required")
    }

    const existedUser = await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    


    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar is required")
    }

    if (!avatar || !avatar.url) {
    throw new ApiError(400, "Failed to upload avatar");
}
if (coverImageLocalPath && !coverImage?.url) {
    console.warn("Cover image failed to upload");
}


    if (!avatar) {
        throw new ApiError(400,"Avatar is required")
    }

    try {
  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
  });
} catch (err) {
  console.error("MongoDB User.create error:", err);
  throw new ApiError(500, "Error creating user");
}


    const createdUSer = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUSer) {
        throw new ApiError(500,"Something went wrong while registrating the user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUSer,"User register Sucessfully")
    )
})



export {registerUser}