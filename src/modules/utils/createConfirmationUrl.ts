import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmationPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
    const token = v4();
    await redis.set(confirmationPrefix + token, userId); // 1 day expiration

    return `http://localhost:3000/user/confirm/${token}`
}