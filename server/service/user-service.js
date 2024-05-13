import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (req) => {
    const user = validate(registerUserValidation, req);

    const userCount = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    });

    if (userCount > 0) {
        throw new ResponseError(409, "Username already registered");
    }

    const hashedPass = bcrypt.hashSync(user.password, 10);

    return prismaClient.user.create({
        data: {
            username: user.username,
            password: hashedPass,
        },
        select: {
            username: true,
        },
    });
};

const login = async (req) => {
    req = validate(loginUserValidation, req);
    const user = await prismaClient.user.findUnique({
        where: {
            username: req.username,
        },
    });

    if (!user) {
        throw new ResponseError(401, "username or password incorrect");
    }
    const passwordIsValid = bcrypt.compareSync(req.password, user.password);
    if (!passwordIsValid) {
        throw new ResponseError(401, "username or password incorrect");
    }

    const token = uuid().toString();
    return prismaClient.user.update({
        data: { token: token },
        where: { username: user.username },
        select: { token: true },
    });
};
const get = async (username) => {
    username = validate(getUserValidation, username);
    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            bio: true,
        },
    });
    if (!user) {
        throw new ResponseError(404, "user not found");
    }
    return user;
};

const logout = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
    });
    if (!user) {
        throw new ResponseError(404, "user not found");
    }

    // remove validation
    return prismaClient.user.update({
        data: { token: null },
        where: { username: user.username },
        select: { username: true },
    });
};

const update = async (req) => {
    req = validate(updateUserValidation, req);
    const userCount = await prismaClient.user.count({
        where: {
            username: req.username,
        },
    });
    if (userCount == 0) {
        throw new ResponseError(404, "user not found");
    }

    const data = {};
    if (req.bio) {
        data.bio = req.bio;
    }
    if (req.password) {
        data.password = bcrypt.hashSync(req.password, 10);
    }
    return prismaClient.user.update({
        data: data,
        where: { username: req.username },
        select: {
            username: true,
            bio: true,
        },
    });
};

export default { register, login, get, logout, update };
