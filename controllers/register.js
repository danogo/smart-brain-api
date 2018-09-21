const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password} = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  var hash = bcrypt.hashSync(password, 10);
  // We use transaction when we want to do 2 things at once, usually modify some data in two tables, for example we can connect queries for multiple tables in the way that we cannot insert in one table when inserting doesn't work in other table, we use trx object instead of db to specify that these queries belong to one transaction
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*') // makes 'then' after insert to return array with inserted objects, like SELECT * FROM users;
      .insert({
        email: loginEmail[0], // we return array with login from login table, we take first element to maintain consistent format in db
        name: name,
        joined: new Date()
      })
      .then(usersResponse => {
        res.json(usersResponse[0]);
      })
      .then(trx.commit)
      .catch(trx.rollback);
    })
  })
  .catch(err => res.status(400).json('unable to register')); // we don't want to give too many info showing 'err' object with all details
};

module.exports = {
  handleRegister
};