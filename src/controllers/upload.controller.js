import  express  from "express";
import prisma from "../utils/prisma.js";
import auth from "../middlewares/auth.js";
import { validateImage } from "../validators/upload.js";

const router = express.Router();

router.get('/', async (req, res) => {
  const allImages = await prisma.image.findMany();
  res.json(allImages);
});

router.post('/', auth, async (req, res) => {
  const data = req.body;

  const validationErrors = validateImage(data);


  if (Object.keys(validationErrors).length !== 0) {
    return res.status(400).send({
      error: validationErrors,
    });
  }

    const imageData = {
        id: data.id,
        name: data.name, 
        file: data.file, 
        description: data.description,
        price: data.price,
        created_at: data.created_at,
        userId: data.user.payload.id,
        title: data.title,
    }

    try {
    const image = await prisma.image.create({
        data: imageData,
    });
    return res.json(image)
    } catch (err) {
        return res.status(500).send({error: "Failed to create image"})
    }
});

router.delete('/:id', auth, async (req, res) => {
    const image = await prisma.image.findUnique({
        where: {
            id: req.params.id,
        }
    })

    if (req.user.id != image.userId) {
        return res.status(401).send({"error": "Unauthorized"})
    }
})

export default router;