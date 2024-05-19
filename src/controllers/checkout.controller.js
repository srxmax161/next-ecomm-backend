import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
router.post('/', async (req, res) => {
    const imagePrice = req.body.price * 100 
    const imageTitle = req.body.title
    const imageUrl = req.body.url

    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data: {
                    currency:'usd',
                    product_data:{
                        name: imageTitle,
                        images: [imageUrl],
                },
                unit_amount: imagePrice,
            },
            quantity: 1,
        },
        ],  
        mode: 'payment', 
        payment_method_types: ['card'],
        success_url: 'http://localhost:5173/',
        cancel_url: 'http://localhost:5173/'
    });

    return res.json(session.url)
});

export default router