const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to: ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(result => {
            console.log('Connected to the DB')
        })
        .catch((error) => {
            console.log('error connecting to the DB: ', error.message)
        })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
