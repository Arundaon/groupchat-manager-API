import Joi from "joi";

const createGroupValidation = Joi.object({
    name: Joi.string().max(32).required(),
    description: Joi.string().max(100),
});

const getGroupValidation = Joi.number().positive().required();

const updateGroupValidation = Joi.object({
    id: Joi.number().positive().required(),
    name: Joi.string().max(32).required(),
    description: Joi.string().max(100),
});
export { createGroupValidation, getGroupValidation, updateGroupValidation };
