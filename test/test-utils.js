import bcrypt from "bcrypt";
import { prismaClient } from "../server/application/database.js";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({ where: { username: "test" } });
};
export const createTestUser = async () => {
    const hashedPass = bcrypt.hashSync("test", 10);
    return prismaClient.user.create({
        data: {
            username: "test",
            password: hashedPass,
            bio: "test bio",
            token: "test",
        },
    });
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test",
        },
    });
};

export const removeTestGroup = async () => {
    const testGroup = await getTestGroup();
    await prismaClient.participants.delete({
        where: {
            username_group_id: { username: "test", group_id: testGroup.id },
        },
    });
    return prismaClient.group.deleteMany({ where: { id: testGroup.id } });
};

export const getTestGroup = async () => {
    return prismaClient.group.findFirst({
        where: {
            name: "testgroup",
        },
    });
};

export const getAdmin = async (groupId) => {
    return prismaClient.participants.findUnique({
        where: { username_group_id: { username: "test", group_id: groupId } },
    });
};

export const createTestUsers = async () => {
    for (let i = 1; i <= 3; i++) {
        const hashedPass = bcrypt.hashSync("test", 10);
        await prismaClient.user.create({
            data: {
                username: `test${i}`,
                password: hashedPass,
                bio: "testbio",
                token: `test${i}`,
            },
        });
    }
};

export const removeTestUsers = async () => {
    await prismaClient.user.deleteMany({ where: { bio: "testbio" } });
};

export const createTestGroups = async () => {
    for (let i = 1; i <= 2; i++) {
        const group = await prismaClient.group.create({
            data: {
                name: `testgroup${i}`,
                description: "testdescription",
            },
        });
        await prismaClient.participants.create({
            data: {
                role: "ADMIN",
                user: {
                    connect: { username: `test${i}` },
                },
                group: {
                    connect: { id: group.id },
                },
            },
        });

        await prismaClient.participants.create({
            data: {
                role: "MEMBER",
                user: {
                    connect: { username: `test3` },
                },
                group: {
                    connect: { id: group.id },
                },
            },
        });
    }
};

export const createTestMessages = async () => {
    const testGroups = await getTestGroups();
    for (let i = 0; i < 2; i++) {
        await prismaClient.message.create({
            data: {
                body: "testmessage",
                group: { connect: { id: testGroups[0].id } },
                user: { connect: { username: "test1" } },
            },
        });
        await prismaClient.message.create({
            data: {
                body: "testmessage",
                group: { connect: { id: testGroups[0].id } },
                user: { connect: { username: "test3" } },
            },
        });
    }
    for (let i = 0; i < 2; i++) {
        await prismaClient.message.create({
            data: {
                body: "testmessage",
                group: { connect: { id: testGroups[1].id } },
                user: { connect: { username: "test2" } },
            },
        });
        await prismaClient.message.create({
            data: {
                body: "testmessage",
                group: { connect: { id: testGroups[1].id } },
                user: { connect: { username: "test3" } },
            },
        });
    }
};

export const removeTestMessages = async () => {
    await prismaClient.message.deleteMany({
        where: {
            body: "testmessage",
        },
    });
};

export const removeTestGroups = async () => {
    await prismaClient.participants.deleteMany({
        where: {
            group: {
                description: "testdescription",
            },
        },
    });
    await prismaClient.group.deleteMany({
        where: { description: "testdescription" },
    });
};

export const getTestGroups = async () => {
    return prismaClient.group.findMany({
        where: {
            description: "testdescription",
        },
    });
};

export const getTestMessages = async () => {
    return prismaClient.message.findMany({
        where: {
            body: "testmessage",
        },
    });
};

export const removeTestMessage = async () => {
    const message = await prismaClient.message.findFirst({
        where: {
            body: "testmessage",
        },
    });
    if (!message) return;
    return prismaClient.message.delete({
        where: {
            id: message.id,
        },
    });
};
