import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import "express-session";
import { User } from "../../entity/User";
import bcrypt from "bcryptjs";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "src/types/MyContext";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async changePassword(@Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext): Promise<User | null> {

        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) {
            return null
        }

        const user = await User.findOne({ where: { id: parseInt(userId, 10) } });

        if (!user) {
            return null
        }

        await redis.del(forgotPasswordPrefix + token);

        user.password = await bcrypt.hash(password, 12);

        await user.save();

        ctx.req.session.userId = user.id;

        return user;
    }
}