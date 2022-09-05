import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { RegisterResolver } from "./modules/user/Register";
import { redis } from "./redis";
import cors from "cors";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [MeResolver, RegisterResolver, LoginResolver],
        validate: true,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }: any) => ({ req })
    });
    

    const app = Express();

    const RedisStore = connectRedis(session);
    

    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
    }))

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redis as any,
                disableTouch: true,
            }),
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
                sameSite: 'lax'
            },
            secret: 'qiwroasdjlasddde',
            resave: false,
            saveUninitialized: false,
            
        })
    );

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("server started on http://localhost:4000/graphql");
    });

}

main();
