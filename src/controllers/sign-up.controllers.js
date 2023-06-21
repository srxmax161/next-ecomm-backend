import express from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { validateUser } from "../validators/sign-up.js";
import { filter } from "../utils/common.js";
import sgMail from "@sendgrid/mail"

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  const data = req.body;
  const msg = {
    to: data.email, // Change to your recipient
    from: "srxmax161@gmail.com", // Change to your verified sender
    subject: "Thank You!!",
    text: `Dear ${data.name}, thank you for registering with us!!`,
  }

  const validationErrors = validateUser(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  data.password = bcrypt.hashSync(data.password, 8);

  prisma.user
    .create({
      data,
    })
    .then((user) => {
      sgMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
        })
        .catch((error) => {
          console.error(error);
        });
      return res.json(filter(user, "id", "name", "email"));
    })
    .catch((err) => {
      // we have unique index on user's email field in our schema, Postgres throws an error when we try to create 2 users with the same email. here's how we catch the error and gracefully return a friendly message to the user.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = "already taken";

        return res.status(500).send({
          error: formattedError,
        });
      }
      throw err;
    });
});

export default router;
