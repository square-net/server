import { Session, User } from "../entities/User";
import { sign } from "jsonwebtoken";

export const createAccessToken = (user: User, session?: Session) => {
    return sign({ id: user.id, sessionId: session?.sessionId }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    });
};

export const createRefreshToken = (user: User, session: Session) => {
    return sign(
        {
            id: user.id,
            tokenVersion: user.tokenVersion,
            sessionId: session.sessionId,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        }
    );
};
