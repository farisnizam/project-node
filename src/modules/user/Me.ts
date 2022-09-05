import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | null> {
        // console.log("CONTENT IN CTX:", ctx.req.session)

        if (!ctx.req.session!.userId) {
            return null
        }

        return User.findOne({ where: { id: ctx.req.session!.userId } });
    }
}