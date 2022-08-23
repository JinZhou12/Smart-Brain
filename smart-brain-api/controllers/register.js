
export const handleRegister = (db, bcrypt) => (req, res) => { 
    const { email, name, password } = req.body;
    //validation
    if(!email || !name|| !password) return res.status(400).json('Incorrect form submition')
    //registration
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
}
