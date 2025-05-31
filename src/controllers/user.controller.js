import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloundinary} from "../utils/cloudinary.js"
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

    const existedUser = User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.covarImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadOnCloundinary(avatarLocalPath)
    const coverImage = await uploadOnCloundinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUSer = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUSer) {
        throw new ApiError(500,"Something went wrong while registrating the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUSer,"User register Sucessfully")
    )
})



export {registerUser}