import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'

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

app.get('/', (req, res)=> {
    // res.json(database.users);
});

app.get('/profile/:id', (req, res)=> {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where('user_id',id)
        .then(user => {
            if(user[0])  res.json(user[0]);
            else  res.status(400).json('no such user');
        })
        .catch(err => res.status(400).json('error getting user'));
});

app.post('/signin', (req, res)=> {
    const { email, password } = req.body;
    db.select('email', 'hash')
        .where('email', '=', email)
        .from('logins')
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash);
            if(isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', user[0].email)
                    .then(user => {
                        res.json(user[0]); 
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }   
            else res.status(400).json("wrong credentials");
        })
        .catch(err => res.status(400).json("wrong credentials"));
});

app.post('/register', (req, res)=> { 
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx('users')
            .returning('*')
            .insert({
                name: name,
                email: email,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
                return trx('logins')
                    .insert({
                        email: user[0].email,
                        hash: hash
                    }).then()
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('email already registered'))
});

app.put('/image', (req, res)=> {
    const { id } = req.body;
    db('users')
        .where('user_id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(data => {
            if(data[0])  res.json(data[0].entries);
            else  res.status(400).json('no such user');
        })
        .catch(err => res.status(400).json('error getting entries'));
});

app.listen(3001, ()=> {
    console.log('app is running on port');
});