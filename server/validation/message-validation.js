import Joi from "joi";

const createMessageValidation = Joi.string().required();
const removeMessageValidation = Joi.number().positive().required();

export { createMessageValidation, removeMessageValidation };
