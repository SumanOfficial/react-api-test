const express = require("express");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/Users");
const User = require("../models/Users");
const { userSignupValidation, userLoginValidation } = require("../validation/validation");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config");
const getUser = require("../middleware/getUser");

// create a user using: POST "/api/auth/createuser". || login not required
router.post("/createuser", userSignupValidation, async (req, res) => {
    // check || catch || display the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // check if the user with the same email already exist
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: "email all ready exist" });
        }

        // encrypting password using bcrypt js
        const salt = await bcrypt.genSalt(10);
        const bcryptedPass = await bcrypt.hash(req.body.password, salt);

        // saving the data - name,email,password to the db || display the response || catch the error (if any)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcryptedPass,
        });
        // jwt token return
        const data = {
            user: {
                id: user.id,
            },
        };
        const jwtToken = jwt.sign(data, JWT_SIGN);

        //returning the token
        res.json(jwtToken);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// login a user: POST "/api/auth/login". || login not required
router.post("/login", userLoginValidation, async (req, res) => {
    // check || catch || display the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // check if email is wrong
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "invalid credentials" });
        }

        /* check if password is wrong ||
         * with bcrypt compare ( this will take 2 param )
         * 1. 1st one is input password[body password]
         * 2. 2nd is db saved password geting from the email
         */

        let userPass = await bcrypt.compare(req.body.password, user.password);
        if (!userPass) {
            return res.status(400).json({ error: "invalid credentials" });
        }

        // jwt token return
        const data = {
            user: {
                id: user.id,
            },
        };
        const jwtToken = jwt.sign(data, JWT_SIGN);
        //returning the token
        res.json(jwtToken);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

// get a user: POST "/api/auth/getuser". || login is required
router.post("/getuser", getUser, async (req, res) => {
    try {
        // check if email is wrong
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error: " + error.message);
    }
});

module.exports = router;
