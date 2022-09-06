import { MyContext } from "src/types/MyContext";
import { MiddlewareFn } from "type-graphql";
import "express-session";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session!.userId) {
        throw new Error('not authenticated');
    }
    return next();
};