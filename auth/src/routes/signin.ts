import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "./../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { Password } from "../services/passwrod";

const router = express.Router();

router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new BadRequestError("Email is not assigned to any account");
      }

      const matchPassword = Password.compare(user.password, password);
      console.log(matchPassword);
      if (!matchPassword) {
        throw new BadRequestError("Invalid password");
      }

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );

      req.session = {
        jwt: userJwt,
      };

      res.send(user);
    } catch (error) {
      throw new BadRequestError("User not found");
    }
  }
);

export { router as signinRouter };
