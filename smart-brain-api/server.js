import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'
import { handleRegister } from './controllers/register.js'
import { handleSignIn } from './controllers/signIn.js'
import { handleApiCall, handleImage } from './controllers/image.js'
import { handleProfile } from './controllers/profile.js'

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',              //same as localhost
        user: 'jinzhou',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {});
app.get('/profile/:id', handleProfile(db));

app.post('/signin', handleSignIn(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.post('/image', handleApiCall)

app.put('/image', handleImage(db));

app.listen(3001, ()=> console.log('app is running on port'));