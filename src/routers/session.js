const express = require('express')
const { Session } = require('../models/session')
const auth = require('../middleware/auth')
const router = express.Router()

const apiPath = process.env.API_PATH || '/api/v1'

// Note: session.end is more of a "last modified" type field which is compared to Date.now() on the frontend
// If Date.now() is greater than session.end by 3600000 (1hr) we request to end the session

// create a session for the appropriate user (on start)
router.post(`${apiPath}/sessions/create/`, auth, async (req, res) => {
    try {
        let session = await Session.findActiveSession(req.user._id)
        if (session) throw new Error('A session is already in progress')
        session = new Session(req.body)
        session.user = req.user._id
        session.start = Date.now()
        session.end = Date.now()
        await session.save()
        res.status(201).json(session)
    } catch (error) {
        res.status(400).json({ error: error.message, errorObj: error })
    }
})

// update session to end state
router.patch(`${apiPath}/sessions/end/`, auth, async (req, res) => {
    try {
        const session = await Session.findActiveSession(req.user._id)
        if (!session) throw new Error('No active session found')
        session.active = false
        await session.save()
        res.status(201).json(session)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// update shot information
router.patch(`${apiPath}/sessions/shot/:id/`, auth, async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            { user: req.user._id, active: true, "shots._id": req.params.id },
            { $set: { "end": Date.now(), "shots.$.hit": req.body.hit, "shots.$.yards": req.body.yards } },
            { new: true }
        );
        if (!session) throw new Error('No active session found for this user or no shot with the given id found')
        res.status(201).json(session)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// update session with shot information
router.patch(`${apiPath}/sessions/shot/`, auth, async (req, res) => {
    try {
        const session = await Session.findActiveSession(req.user._id)
        if (!session) throw new Error('No active session found')
        session.end = Date.now()
        session.shots.push({ hit: req.body.hit, yards: req.body.yards })
        await session.save()
        res.status(201).json(session)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// delete shot information
router.delete(`${apiPath}/sessions/shot/:id/`, auth, async (req, res) => {
    try {
        const session = await Session.findActiveSession(req.user._id)
        if (!session) throw new Error('No active session found')
        session.shots = session.shots.filter(shot => shot._id.toString() !== req.params.id)
        session.end = Date.now()
        await session.save()
        res.status(201).json(session)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// get all of the users sessions
router.get(`${apiPath}/sessions/`, auth, async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
        res.json(sessions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// get a specific user session
router.get(`${apiPath}/sessions/:id/`, auth, async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, user: req.user._id })
        if (!session) return res.status(404).send()
        res.json(session)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// auto expire session in an hour
// const endSessionTimeout = (sessionID, userID, expire_timer) => {
//     if (expire_timer) clearTimeout(expire_timer)
//     const sessionTimer = setTimeout(() => {
//         const activeSession = Session.findOne({ _id: sessionID, user: userID, active: true }).then(session => {
//             if (!activeSession) throw new Error('No active session found when trying to end session via timeout')
//             activeSession.end = Date.now()
//             activeSession.active = false
//             activeSession.save()
//         }).catch(error => { console.log('Error when trying to end session via timeout', error.message) })
//     }, '3600000')
//     return sessionTimer
// }

// router.patch('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
//     const allowedUpdates = ['description', 'completed']
//     const updates = Object.keys(req.body)
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update))

//     if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

//     try {
//         const task = await Task.findById(_id)
//         updates.forEach(update => task[update] = req.body[update])
//         await task.save()
//         if (!task) return res.status(404).send()
//         res.send(task)
//     } catch (error) {
//         res.status(400).send(error)
//     }

// })

// router.delete('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findByIdAndDelete(_id)
//         if (!task) return res.status(404).send()
//         res.send(task)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

module.exports = router