const { body } = require("express-validator");
/**
 * all of the validation of the api is here
 */

// user signup validation []
const userSignupValidation = [
    // name fild should not be empty || trim down the string || escape the sp.charectors ||
    body("name", "Name is required").not().isEmpty().trim().escape(),
    // username must be an email
    body("email", "Email is not valid").isEmail().normalizeEmail(),

    // password must be at least 8 chars long
    body("password", "Password must be 8 charector long").isLength({ min: 4 }),
];
// user login validation []
const userLoginValidation = [
    // username must be an email || not empty
    body("email", "Email is not valid").isEmail().normalizeEmail().exists(),
    // password must be at least 8 chars long || not empty
    body("password", "Password must be 8 charector long").isLength({ min: 4 }).exists(),
];

// user signup validation []
const addNoteValidation = [
    // title should not be empty || trim down the string || escape the sp.charectors ||
    body("title", "title is required").not().isEmpty().trim().escape(),
    // description should not be empty || trim down the string || escape the sp.charectors ||
    body("description", "description is required").not().isEmpty().trim().escape(),
];

module.exports = { userSignupValidation, userLoginValidation, addNoteValidation };
