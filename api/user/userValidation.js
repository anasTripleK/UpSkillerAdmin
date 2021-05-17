// Validation
const Joi=require('@hapi/joi');

// SignUp Validation Schema
const userValidation = data =>{
    const schema = Joi.object({
            username: Joi.string().min(3).required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().required()
    });
    return schema.validate(data);
};
const loginValidation = data => {
    const schema = Joi.object({
            username: Joi.string().required().min(3),
            password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};
module.exports.loginValidation = loginValidation;
module.exports.userValidation = userValidation;