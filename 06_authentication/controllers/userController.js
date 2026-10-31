// NOTES: Route handlers live here, separate from URL registration and database
// schema definitions. Each handler reads request data, performs its operation,
// and sends the corresponding HTTP response.
// Express places parsed JSON request data on req.body; express.json() is set up
// in the application entry point before these handlers are reached.
const User = require('../models/User');
// uuid is only referenced by the commented-out server-side session example.
const {v4: uuidv4} = require('uuid');
const {setUser} = require('../service/auth');


// NOTES: Create a user document from the JSON body (username and password).
// The model supplies the default "free" role. On success, return a short
// confirmation and role; the full user document is not returned here.
async function handleUserSignUp(req,res) {
    // The schema supplies the default role when the request does not provide
    // one, so newly registered accounts are free users by default.
    const { username,password } = req.body;
    const user = await User.create({
        username,
        password,
    });
    return res.json({ message: 'User registered successfully', role: user.role });
}


// NOTES: Look up a matching account, create an authentication token, then set
// it in the browser's "token" cookie. The login page receives the role in the
// JSON response; subsequent requests send the cookie for server-side checks.
async function handleUserLogin(req,res) {
    const {username,password} = req.body;
    // Search for an exact username/password match. If no account matches, send
    // an HTTP 401 response and do not create an authentication token.
    const user = await User.findOne({ username,password });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    // NOTES: An alternative design would create a random session ID and keep
    // the user record in a server-side store instead of using a signed token.
    // The commented lines below illustrate that different approach.
    // const sessionId = uuidv4();
    // This sends the user data to the token helper, which builds a plain JWT
    // payload. The current helper selects its own payload fields.
    const token = setUser({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
    });
    // Store the signed token in an HTTP response cookie. The browser retains
    // that cookie and sends it automatically on later same-origin requests.
    // setUser(sessionId,user);
    // return res.cookie('uid', sessionId).json({
    //     message: 'Login Successful',
    //     username: user.username,
    //     role: user.role,
    // });

     return res.cookie('token', token).json({
        message: 'Login Successful',
        username: user.username,
        role: user.role,
    });
}

// NOTES: Fetch every user document and serialize the results as JSON. This
// handler has no authorization check in this controller; any access control
// would need to be attached when registering its route.
async function handleGetUsers(req,res) {
    const users = await User.find();
    return res.json(users);
}




// Export handlers for the Express router; importing this module does not
// register routes by itself. The router chooses which URL and HTTP method
// invokes each function.
module.exports = {
    handleUserSignUp,
    handleUserLogin,
    handleGetUsers,
}