import Joi from 'joi';

export const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required()
            .messages({
                'string.alphanum': 'Le nom d utilisateur ne doit contenir que des lettres et des chiffres.',
                'string.min': 'Le nom d utilisateur doit avoir au moins 3 caractères.',
                'string.max': 'Le nom d utilisateur ne doit pas dépasser 30 caractères.',
                'any.required': 'Le nom d utilisateur est requis.'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Veuillez fournir une adresse email valide.',
                'any.required': 'L adresse email est requise.'
            }),
        password: Joi.string().min(6).required()
            .messages({
                'string.min': 'Le mot de passe doit avoir au moins 6 caractères.',
                'any.required': 'Le mot de passe est requis.'
            }),
        fullName: Joi.string().min(2).max(100).optional(),
        country: Joi.string().max(100).optional(),
        language: Joi.string().length(2).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Veuillez fournir une adresse email valide.',
                'any.required': 'L adresse email est requise.'
            }),
        password: Joi.string().required()
            .messages({
                'any.required': 'Le mot de passe est requis.'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateContentAnalysis = (req, res, next) => {
    const schema = Joi.object({
        contentText: Joi.string().min(10).max(10000).when('contentType', {
            is: 'text',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        contentUrl: Joi.string().uri().when('contentType', {
            is: 'url',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        contentType: Joi.string().valid('text', 'url', 'image', 'video').required()
    }).xor('contentText', 'contentUrl');

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateQuizSubmission = (req, res, next) => {
    const schema = Joi.object({
        quizId: Joi.number().integer().positive().required(),
        answers: Joi.object().pattern(Joi.number().integer().positive(), Joi.string()).required(),
        timeSpent: Joi.number().integer().min(0).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateTrustedSource = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        url: Joi.string().uri().required(),
        description: Joi.string().max(1000).optional(),
        category: Joi.string().valid('news', 'education', 'government', 'research', 'international').required(),
        country: Joi.string().max(100).optional(),
        language: Joi.string().max(50).optional(),
        reliabilityScore: Joi.number().min(0).max(1).optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};