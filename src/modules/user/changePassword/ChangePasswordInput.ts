import { PasswordInput } from "../../Shared/PasswordInput";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput extends PasswordInput{
    @Field()
    token: string;
}