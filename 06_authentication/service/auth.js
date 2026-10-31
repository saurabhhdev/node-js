// NOTES: Authentication-token helper functions shared by the login controller
// and request middleware. The older in-memory session-map implementation is
// preserved below as a commented example and is not active.
// const sessionIdToUserMap = new Map();

// function setUser(id,user) {
//     sessionIdToUserMap.set(id,user);
// }

// function getUser(id) {
//     return sessionIdToUserMap.get(id);
// }

// module.exports = {
//     setUser,
//     getUser,
// };


const jwt = require('jsonwebtoken');

// NOTES: Tokens created and checked in this module use the same signing secret.
// In a deployed application this value should be supplied through protected
// configuration rather than committed source code.
const secret = 'Saurabh@060307';


function setUser(user) {
    // Build and sign a JWT payload. In the current implementation this includes
    // username, password, and role; JWT signing does not encrypt these values,
    // so anyone who obtains the token can decode its payload.
    return jwt.sign(
    {
      username: user.username,
      password: user.password,
      role: user.role,
    },
    secret
);
}

function getUser(token) {
    // Verify the signature with the same secret used by setUser, then decode
    // the payload. Invalid tokens cause jsonwebtoken to throw an error.
    return jwt.verify(token,secret);
}

// Keep token creation and verification behind a small shared service interface
// so controllers and middleware do not call jsonwebtoken directly.
module.exports = {
    setUser,
    getUser,
};
