import { Resolver, Mutation, Arg } from "type-graphql";
import "express-session";
import { redis } from "../../redis";
import { User } from "../../entity/User";
import { confirmUserPrefix } from "../constants/redisPrefixes";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
        await redis.del(token);

        return true
    }
}