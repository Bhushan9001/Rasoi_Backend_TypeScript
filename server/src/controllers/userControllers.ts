import { Request, Response } from "express";
import prisma from "../prisma";
import { hashSync, compareSync } from "bcryptjs";
import jwt from 'jsonwebtoken';

interface User {
    email: string,
    name: string,
    password: string
}

const authController = {

    signup: async (req: Request, res: Response) => {
       
        const { email, name, password }:User = req.body;
        try {

            const existingUser = await prisma.user.findUnique({
                where: { email: email }
            })
            if (existingUser) return res.status(400).json({ "message": "already existing user!!" });
            const hashedPasword: string = hashSync(password, 10);
            const user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: hashedPasword
                }
            })
            if (!user) {
                return res.status(404).json({ "message": "User not found" });
            }
            res.status(201).json({ "message": "Signed up successfully!!", user })
        } catch (error) {
            console.log(error)
            res.status(501).json({ "message": "Some thing Went wrong" })

        }

    },
    signin: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({
                where: { email: email }
            })
            if (!user) {
                return res.status(404).json({ "message": "Incorrect Email or Password" });
            }
            if (!compareSync(password, user.password)) return res.status(404).json({ "message": "Incorrect Email or Password" })

            const payload = {
                id: user.id,
                name: user.name
            }
            const secret:string = String(process.env.JWT_SECRET);
            const token = jwt.sign(payload,secret,{ expiresIn: "1d" });

            res.status(201).json({ "Message": "User Loged in Succesfully!!", user, "token": "Bearer " + token });

        } catch (error) {
            console.log(error)
            res.status(501).json({ "message": "Some thing Went wrong" })
        }
    }
}

export default authController;