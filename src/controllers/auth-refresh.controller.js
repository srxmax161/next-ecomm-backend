import auth from "../middlewares/auth.js";
import prisma from "../utils/prisma.js";
import express from "express"
import { filter } from "../utils/common.js"
import { signAccessToken } from "../utils/jwt.js";

const router = express.Router()

// verify authencity of refresh token with payload of user id
router.post('/', auth, async (req, res) => {

    const userId = req.user.payload.id

    // finds User in database via UserId, if user is found, a new access token is generated and returned
    try{
        const user = await prisma.user.findUnique({ where : { id: userId } })
        if (!user ) throw 'User not found';

        const filteredUser = filter(user,"id", "name", "email")
        const accessToken = await signAccessToken(filteredUser);
        return res.json( accessToken )
    } catch (err) {
        console.error(`Error refreshing access token: ${err.message}`)
        return res.status(401).json({ error: 'Invalid refresh token' })
    }     
    })

    export default router