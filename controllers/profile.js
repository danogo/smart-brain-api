const handleProfileGet = db => (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id: id})
    .then(responseUser => {
      if (responseUser.length) {
        res.json(responseUser[0]);
      } else {
        throw new Error('Could not find that user');
      }
    })
    .catch(err => {
      res.status(404).json(err.message);
    });
};

module.exports = {
  handleProfileGet
};