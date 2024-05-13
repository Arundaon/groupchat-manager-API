import { ResponseError } from "../error/response-error.js";

export const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
    }
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message,
        });
    } else {
        res.status(500).json({
            errors: err.message,
        });
        console.log(err.message);
        console.log(err);
    }
};
