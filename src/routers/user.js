const express = require('express')
const User = require('../models/user')
const router = new express.Router();
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

router.get('/users/me', auth, async (req, res) => {
    /*   User.find({}).then((users) => {
           res.status(200).send(users);
       }).catch((e) => {
           res.status(500).send(e);
       })*/

 /*   try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send(e);
    }*/

    res.send(req.user);

});

/*router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    /!*   User.findById(_id).then((user) => {
           if (!user) {
               return res.status(404).send();
           }

           res.status(200).send(user);
       }).catch((e) => {
           res.status(500).send(e);
       });*!/
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send('Please input correct user id');
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
})*/

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.status(200).send({user , token})
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send();
    }catch (e) {
        res.status(500).send('Something went wrong');
    }
});

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = [];
        await req.user.save()
        res.status(200).send()
    }catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    /*  user.save().then(() => {
         res.status(201).send(user);
     }).catch((e) => {
         // res.status(400)
         // first send the status
         res.status(400).send(e);
     })*/

    try {
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name)
        // await user.save();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
})

/*router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedToUpdate = ['name', 'age', 'email', 'password'];
    const isInvalid = updates.every((update) => {
        return allowedToUpdate.includes(update);
    })

    if (!isInvalid){
        return res.status(400).send({ 'error': 'There is no property like that'})
    }

    try {
        const user = await User.findById(req.params.id);

        updates.forEach((update) =>  user[update] = req.body[update]);
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send({'error': 'please input correct user'});
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(400).send(e)
    }
})*/

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedToUpdate = ['name', 'age', 'email', 'password'];
    const isInvalid = updates.every((update) => {
        return allowedToUpdate.includes(update);
    })

    if (!isInvalid){
        return res.status(400).send({ 'error': 'There is no property like that'})
    }

    try {
        // req.user enne auth eken
        updates.forEach((update) =>  req.user[update] = req.body[update]);
        await req.user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e)
    }
})

/*router.delete('/users/:id', async (req,res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).send({'error': 'Please check the user id'});
        }
        res.status(200).send(user)
    }catch (e) {
        res.status(500).send(e);
    }
})*/

router.delete('/users/me',auth, async (req,res) => {

    try{
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;