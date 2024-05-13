import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user-validation.js";

const checkUserMustExists = async (username) => {
    username = validate(getUserValidation, username);

    const userCount = await prismaClient.user.count({
        where: { username: username },
    });

    if (userCount == 0) {
        throw new ResponseError(404, "user not found");
    }
    return username;
};

const getUserRole = async (groupId, username) => {
    const participant = await prismaClient.participants.findUnique({
        where: {
            username_group_id: {
                group_id: groupId,
                username: username,
            },
        },
        select: {
            role: true,
        },
    });

    if (!participant) {
        throw new ResponseError(403, "Not joined the group");
    }

    return participant.role;
};

export { checkUserMustExists, getUserRole };
