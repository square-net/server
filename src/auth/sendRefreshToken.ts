import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie("cke", token, {
        httpOnly: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: true,
    });
};
