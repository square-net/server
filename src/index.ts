import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import path from "path";
import favicon from "serve-favicon";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { Session, User } from "./entities/User";
import { createAccessToken, createRefreshToken } from "./auth/auth";
import { sendRefreshToken } from "./auth/sendRefreshToken";
import { PostResolver } from "./resolvers/PostResolver";
import { getPresignedUrl } from "./helpers/getPresignedUrl";

async function main() {
    const app = express();

    app.use(cookieParser());

    const allowList = [process.env.CLIENT_ORIGIN!];

    app.use(
        cors({
            origin(requestOrigin, callback) {
                if (allowList.indexOf(requestOrigin!) !== -1) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            },
            credentials: true,
        })
    );

    app.use(express.static(path.join(__dirname, "./public")));
    app.use(favicon(path.join(__dirname, "./public", "favicon.ico")));
    app.get(process.env.NODE_ENV === "production" ? "/*" : "/", (_req, res) => {
        res.sendFile("index.html", {
            root: path.join(__dirname, "./public"),
        });
    });

    app.use(express.json());

    app.post("/", async (req, res) => {
        const token = req.cookies.cke;

        if (!token) {
            return res.send({ ok: false, accessToken: "", sessionId: "" });
        }

        let payload: any = null;

        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            console.error(error);
            return res.send({ ok: false, accessToken: "", sessionId: "" });
        }

        const user = await User.findOne({ where: { id: payload.id }, relations: ["sessions"] });
        const session = await Session.findOne({ where: { sessionId: payload.sessionId }, relations: ["user"] });

        if (!user || !session) {
            return res.send({ ok: false, accessToken: "", sessionId: "" });
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "", sessionId: "" });
        }

        sendRefreshToken(res, createRefreshToken(user, session));

        return res.send({ ok: true, accessToken: createAccessToken(user, session), sessionId: session.sessionId });
    });

    app.post("/users", async (_, res) => {
        let rawUsers = await User.find();
        let users: any = [];

        rawUsers.map((user: User) => (
            users.push({
                name: user.firstName + " " + user.lastName,
                link: "/" + user.username,
                avatar: user.profile?.profilePicture as string,
            })
        ));

        if (users.length > 0) {
            return res.send({ ok: true, users });
        } else {
            return res.send({ ok: false, users: [] });
        }
    });

    app.post("/presigned-url", async (req, res) => {
        const { key } = req.body;
        const url = await getPresignedUrl(key);
        res.send({ url });
    });

    await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: ["src/entities/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
        subscribers: ["src/subscribers/**/*.ts"],
        cli: {
            entitiesDir: "src/entities",
            migrationsDir: "src/migrations",
            subscribersDir: "src/subscribers",
        },
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    await server.start();

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log("Square server started.");
    });
}

main().catch((error) => {
    console.log(error);
});
