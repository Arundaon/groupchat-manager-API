import { prismaClient } from "../application/database.js";
import { getUserRole } from "./utils.js";
import {
    createMessageValidation,
    removeMessageValidation,
} from "../validation/message-validation.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";

const list = async (groupId, username) => {
    await getUserRole(groupId, username); //is joined the group

    return prismaClient.message.findMany({
        where: {
            group_id: groupId,
        },
    });
};

const create = async (groupId, username, message) => {
    message = validate(createMessageValidation, message);
    await getUserRole(groupId, username); //is joined the group

    return prismaClient.message.create({
        data: {
            body: message,
            group: { connect: { id: groupId } },
            user: { connect: { username: username } },
        },
        select: {
            id: true,
            body: true,
            created_at: true,
            username: true,
        },
    });
};

const remove = async (groupId, username, messageId) => {
    messageId = validate(removeMessageValidation, messageId);
    //is joined the group
    await getUserRole(groupId, username);

    // is owner of the message
    const message = await prismaClient.message.findUnique({
        where: {
            id: messageId,
        },
    });

    if (!message) {
        throw new ResponseError(404, "Message not found");
    }

    if (message.username != username) {
        throw new ResponseError(403, "Not the owner of the message");
    }

    return prismaClient.message.delete({
        where: {
            id: messageId,
        },
    });
};

export default { list, create, remove };
