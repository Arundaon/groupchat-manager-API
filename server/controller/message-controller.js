import messageService from "../service/message-service.js";

const create = async (req, res, next) => {
    try {
        const result = await messageService.create(
            parseInt(req.params.groupId),
            req.user.username,
            req.body.body
        );
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const list = async (req, res, next) => {
    try {
        const result = await messageService.list(
            parseInt(req.params.groupId),
            req.user.username
        );
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await messageService.remove(
            parseInt(req.params.groupId),
            req.user.username,
            req.params.messageId
        );
        res.status(200).json({ data: "OK" });
    } catch (err) {
        next(err);
    }
};

export default { create, list, remove };
