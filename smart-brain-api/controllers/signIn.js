
export const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json('Incorrect form submition')
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
}