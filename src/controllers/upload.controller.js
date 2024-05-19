import express from "express";
import prisma from "../utils/prisma.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const allImages = await prisma.image.findMany();
  res.json(allImages);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const image = await prisma.image.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(image);
});

router.post("/", auth, async (req, res) => {
  const databody = req.body;
  const dataID = req.user.payload.id;
  const data = { ...databody, userId: dataID }; 

  prisma.image.create({ 
    data,})
    .then((image) => {
      return res.json(image);
    });
});

router.delete("/:id", auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const image = await prisma.image.findUnique({
    where: { 
      id: id, 
    },
  });

  if (req.user.payload.id != image.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  await prisma.image
    .delete({
      where: {
        id: id,
      },
    })
    .then((image) => {
      return res.json(image);
    });
});

export default router;
