const express = require('express')
const { User } = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

const apiPath = process.env.API_PATH || '/api/v1'

// create new user
router.post(`${apiPath}/users/`, async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

// user log in
router.post(`${apiPath}/users/login/`, async (req, res) => {
    try {
        console.log(req.body.username, req.body.password)
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.json({ user, token })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

// user singular device log out
router.post(`${apiPath}/users/logout/`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// user log out all devices
router.post(`${apiPath}/users/logallout/`, auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// get user profile
router.get(`${apiPath}/users/me/`, auth, async (req, res) => {
    res.send(req.user)
})

// router.get(`${apiPath}/users/:id`, async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id)
//         if (!user) return res.status(404).send()
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

// router.patch(`${apiPath}/users/:id`, async (req, res) => {
//     const _id = req.params.id
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update))

//     if (!isValidOperation) return res.status(400).send({ error: 'Invalid update!' })

//     try {
//         const user = await User.findById(_id)
//         updates.forEach(update => user[update] = req.body[update])
//         await user.save()
//         if (!user) return res.status(404).send()
//         res.send(user)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

// router.delete(`${apiPath}/users/:id`, async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findByIdAndDelete(_id)
//         if (!user) return res.status(404).send()
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

module.exports = router