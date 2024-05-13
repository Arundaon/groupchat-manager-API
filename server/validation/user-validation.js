import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string().max(100).required(),
    bio: Joi.string(),
});

const loginUserValidation = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string().max(100).required(),
});

const updateUserValidation = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string().max(100),
    bio: Joi.string(),
});

const getUserValidation = Joi.string().min(3).max(16).required();

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
};
