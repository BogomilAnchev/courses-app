const { body } = require('express-validator');

module.exports = [
    body('name').custom((value, { req }) => {
        if (value.length < 4) {
            throw new Error('Cube name must be at least 4 chars long!')
        }
        return true;
    }),
    body('description').custom((value, { req }) => {
        if (value.length < 20) {
            throw new Error('Cube desc must be at least 20 chars long!')
        }
        return true;
    }),
    body('imageUrl').custom((value, { req }) => {
        if (!value.startsWith("http") || !value.startsWith("https")) {
            throw new Error('The imageUrl should starts with http or https!')
        }
        return true;
    })
];