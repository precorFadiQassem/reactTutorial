import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const users = {
    tomjones: {
        username: 'tomjones',
        password: bcrypt.hashSync('password', 10),
        email: 'tom@jones.com',
        firstName: 'Tom',
        lastName: 'Jones',
        role: 'USER'
    }
};

const JWT_SECRET = 'SUPER_DUPER_SECURE_SECRET';

const api = express();
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const generateToken = (user) => {
    return jwt.sign(user, JWT_SECRET, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
};

//Sample GET API
router.get('/testGet', (req, res) => {
    res.send('Hello!');
});

router.post('/testPost', (req, res) => {
    res.send('Hello!');
});

router.post('/signIn', urlencodedParser, (req, res) => {
    const credentials = req.body;

    if(!credentials) {
        return res.sendStatus(400);
    }

    if(!credentials.username || !credentials.password) {
        return res.status(400).send('Missing username or password');
    }

    const user = users[credentials.username];
    if(user === undefined) {
        return res.status(400).send('User not found');
    }

    bcrypt.compare(credentials.password, user.password, (err, bcryptResult) => {
        if(err) throw err;
        if(bcryptResult) {
            //include only relevant user fields
            const truncatedUserData = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: 'MAGIC_TOKEN'
            };
            const userToken = generateToken(truncatedUserData);
            return res.status(200).send({ token: userToken, userData: truncatedUserData });
        }
        return res.status(401).send({ password: 'Username or password was invalid' });
    });
});

//CORS
api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Resolve '/api' prefixed routes
api.use('/api', router);

export default api;
