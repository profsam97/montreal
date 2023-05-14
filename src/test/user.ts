import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {User} from "../Models/User";

export const tokenId = new mongoose.Types.ObjectId();
export const userOne = {
    _id: tokenId,
    email: 'proft@jfg.com',
    password: '1233333',
    tokens: [{
        token: jwt.sign({_id: tokenId}, 'Montreal')
    }]

}

export const setUpDataBase   = async () => {
    await new User(userOne).save()
}