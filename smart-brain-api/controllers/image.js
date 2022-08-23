import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey:'d12aeeae2b664b30bf579afe505cab34'
});

export const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API'))
}

export const handleImage = (db) => (req, res) => {
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
}