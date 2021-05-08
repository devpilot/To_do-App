const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Data = require('../models/Data');
const DateTimeFormat = require("../DateTimeFormat");

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', { title: 'Welcome' }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Data.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean().then((result) => {
    result = DateTimeFormat(result)
    res.render('dashboard', { title: 'All Tasks', tasks: result, user: req.user })
  }).catch((err) => {
    console.log(err);
  });
});

// insert tasks
router.post('/dashboard', (req, res) => {
  const { _id, date, time, text, isDone } = req.body
  // update task status
  if (_id && isDone) {
    Data.updateOne({ _id: _id, userId: req.user._id }, { isDone: isDone })
      .then(() => res.sendStatus(200))
      .catch((err) => console.log(err));
  } else {
    // insert task
    if (text) {
      let taskDetails = { ...req.body, userId: req.user._id }
      if (date && time) {
        dueDate = new Date(date + ' ' + time)
        taskDetails = Object.assign(taskDetails, { dueDate: dueDate })
      }
      const task = new Data(taskDetails);
      task.save()
        .then(() => res.redirect('/dashboard'))
        .catch((err) => console.log(err));
    }
  }
});

// delete tasks
router.delete('/dashboard/:id', (req, res) => {
  const id = req.params.id;
  Data.deleteOne({ _id: id, userId: req.user._id })
    .then(() => res.json({ redirect: '/dashboard' }))
    .catch(err => console.log(err));
});

module.exports = router;
