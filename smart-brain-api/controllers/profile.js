
export const handleProfile = (db) => (req, res) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where('user_id',id)
        .then(user => {
            if(user[0])  res.json(user[0]);
            else  res.status(400).json('no such user');
        })
        .catch(err => res.status(400).json('error getting user'));
}