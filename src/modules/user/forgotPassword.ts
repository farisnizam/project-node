import { Resolver, Mutation, Arg } from "type-graphql";
import "express-session";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../../entity/User";
import { v4 } from "uuid";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string): Promise<boolean> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return true
        }
        const token = v4();
        await redis.set(forgotPasswordPrefix + token, user.id); // 1 day expiration

        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`);

        return true
    }
}