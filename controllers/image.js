const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env
 });

const handleClarifaiCall = (req, res) => {
  clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.status(400).json('unable to work with api');
  });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('detections', 1)
    .returning('detections')
    .then(responseDetections => {
      if (responseDetections.length) {
        res.json(responseDetections[0]);
      } else {
        throw new Error('unable to get the user');
      }
    })
    .catch(err => {
      res.status(400).json(err.message);
    });
};

module.exports = {
  handleImage,
  handleClarifaiCall
};