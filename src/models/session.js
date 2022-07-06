const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    shots: [{
        hit: {
            type: Boolean,
            default: false,
            require: true,
        },
        yards: {
            type: Number,
            default: 0,
            require: false,
            validate(value) { if (value < 0) throw new Error('Yards must be a positive number') }
        }
    }],
    active: {
        type: Boolean,
        default: true,
        require: false,
    },
    start: {
        type: Number,
        default: 0,
        required: true,
        _id: false
    },
    end: {
        type: Number,
        default: 0,
        required: false,
        _id: false
    },
    user: {
        _id: false,
        type: Object, 
        required: true
    },
    expire_timer: {
        _id: false, 
        type: Object,
        required: false
    }
})

sessionSchema.statics.findActiveSession = async (user) => {
    const session = await Session.findOne({ user, active: true })
    return session
}

const Session = mongoose.model('Session', sessionSchema)

module.exports = { Session }