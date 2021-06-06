const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/tasks',auth, async (req, res) => {
// without AUTHENTICATION
    /*  Task.find({}).then((tasks) => {
          res.status(200).send(tasks);
      }).catch((e) => {
          res.status(500).send(e);
      })*/
    // with AUTHENTICATION
    const match = {}
    if (req.query.completed){
        match.completed = req.query.completed === 'true';
    }
    try {
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    /*  Task.findById(_id).then((task) => {
          if (!task) {
              return res.status(404).send();
          }

          res.status(200).send(task);
      }).catch((e) => {
          res.status(500).send(e);
      });*/

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})


router.post('/tasks', auth, async (req, res) => {

    /*  task.save().then(() => {
         res.status(201).send(task);
     }).catch((e) => {
         res.status(400).send(e);
     })*/
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})


router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedToUpdate = ['description', 'completed'];
    const isInvalid = updates.every((update) => {
        return allowedToUpdate.includes(update);
    })

    if (!isInvalid) {
        return res.status(400).send({'error': 'There is no property like that'});
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({'error': 'No user found, Please check the ID'})
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})


router.delete('/tasks/:id',auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;