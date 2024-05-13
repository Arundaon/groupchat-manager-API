import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
    createGroupValidation,
    getGroupValidation,
    updateGroupValidation,
} from "../validation/group-validation.js";

import { checkUserMustExists, getUserRole } from "./utils.js";
import { getUserValidation } from "../validation/user-validation.js";

const create = async (username, req) => {
    req = validate(createGroupValidation, req);
    username = await checkUserMustExists(username);

    const newGroup = await prismaClient.group.create({
        data: req,
        select: { id: true, name: true, description: true, created_at: true },
    });

    //set admin
    await prismaClient.participants.create({
        data: {
            role: "ADMIN",
            user: {
                connect: { username: username },
            },
            group: {
                connect: { id: newGroup.id },
            },
        },
    });

    return newGroup;
};

const get = async (groupId, username) => {
    groupId = validate(getGroupValidation, groupId);
    const userRole = await getUserRole(groupId, username); // see if a member by getting the role

    const group = await prismaClient.group.findUnique({
        where: {
            id: groupId,
        },
    });

    if (!group) {
        throw new ResponseError(404, "Group not found");
    }

    return group;
};

const list = async (username) => {
    username = await checkUserMustExists(username);

    // TODO : find group where user participated in
    // return prismaClient.group.findMany({
    //     where: {
    //         participants,
    //     },
    // });
    return prismaClient.participants.findMany({
        where: {
            username: username,
        },
        include: {
            group: true,
        },
    });
};

const update = async (username, req) => {
    req = validate(updateGroupValidation, req);
    username = await checkUserMustExists(username);

    const userRole = await getUserRole(req.id, username);

    // check is user admin of the server

    if (userRole == "MEMBER") {
        throw new ResponseError(403, "Not an admin of the group");
    }

    return prismaClient.group.update({
        data: req,
        where: {
            id: req.id,
        },
        select: {
            id: true,
            name: true,
            description: true,
        },
    });
};

const addMember = async (username, groupId, memberUsername) => {
    memberUsername = validate(getUserValidation, memberUsername);

    username = await checkUserMustExists(username);

    const userRole = await getUserRole(groupId, username);
    if (userRole == "MEMBER") {
        throw new ResponseError(403, "Not an admin of the group");
    }

    memberUsername = await checkUserMustExists(memberUsername);

    const checkMemberJoined = await prismaClient.participants.findUnique({
        where: {
            username_group_id: {
                group_id: groupId,
                username: memberUsername,
            },
        },
        select: {
            role: true,
        },
    });
    if (checkMemberJoined) {
        throw new ResponseError(409, "Member already joined");
    }

    return prismaClient.participants.create({
        data: {
            role: "MEMBER",
            user: {
                connect: { username: memberUsername },
            },
            group: {
                connect: { id: groupId },
            },
        },
        select: {
            username: true,
            role: true,
        },
    });
};

const removeMember = async (username, groupId, memberUsername) => {
    memberUsername = validate(getUserValidation, memberUsername);

    username = await checkUserMustExists(username);
    const userRole = await getUserRole(groupId, username);
    if (userRole == "MEMBER") {
        throw new ResponseError(403, "Not an admin of the group");
    }

    memberUsername = await checkUserMustExists(memberUsername);

    const checkMemberJoined = await getUserRole(groupId, memberUsername);
    if (!checkMemberJoined) {
        throw new ResponseError(404, "User not found");
    }

    return prismaClient.participants.delete({
        where: {
            username_group_id: {
                group_id: groupId,
                username: memberUsername,
            },
        },
    });
};

export default { create, get, update, list, addMember, removeMember };
