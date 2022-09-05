import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";
import "express-session";

declare module "express-session" {
    interface SessionData {
        userId: any;
    }
}

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return null
        }

        ctx.req.session!.userId = user.id;

        console.log("data:", ctx.req.session!.userId)

        return user;
    }
}