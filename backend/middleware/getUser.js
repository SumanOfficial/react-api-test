const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config");

const getUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "invalid auth token" });
    }

    try {
        const jwtMatch = jwt.verify(token, JWT_SIGN);
        req.user = jwtMatch.user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).send({ error: "invalid auth token" });
    }
};

module.exports = getUser;
