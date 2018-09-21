const handleSignIn = (req, res, db, bcrypt) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash); // comparing password inserted by user with password for the same email in db, compareSyn return true or false
      if (isValid) {
        return db.select('*').from('users')
          .where({email: email})
          .then(responseUser => {
            console.log(responseUser);
            res.json(responseUser[0]);
          })
          .catch(err => res.status(400).json('unable to get user with provided credentials'));
      } else {
        return res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
  handleSignIn
};