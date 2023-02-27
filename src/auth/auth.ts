import { User } from "../entities/User";
import { sign } from "jsonwebtoken";

export const createAccessToken = (user: User) => {
    return sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    });
};

export const createRefreshToken = (user: User) => {
    return sign(
        {
            id: user.id,
            tokenVersion: user.tokenVersion,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        }
    );
};
