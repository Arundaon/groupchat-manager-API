import groupService from "../service/group-service.js";

const create = async (req, res, next) => {
    try {
        const result = await groupService.create(req.user.username, req.body);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const get = async (req, res, next) => {
    try {
        const result = await groupService.get(
            req.params.groupId,
            req.user.username
        );
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const list = async (req, res, next) => {
    try {
        const result = await groupService.list(req.user.username);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        req.body.id = req.params.groupId;
        const result = await groupService.update(req.user.username, req.body);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const addMember = async (req, res, next) => {
    try {
        const result = await groupService.addMember(
            req.user.username,
            parseInt(req.params.groupId),
            req.body.username
        );
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const removeMember = async (req, res, next) => {
    try {
        await groupService.removeMember(
            req.user.username,
            parseInt(req.params.groupId),
            req.params.memberUsername
        );
        res.status(200).json({ data: "OK" });
    } catch (err) {
        next(err);
    }
};
export default { create, get, update, list, addMember, removeMember };
