import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/ashyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

//we can use _ for res if it is not in use in production codes
export const verifyJWT  = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized access")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user
        return next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})