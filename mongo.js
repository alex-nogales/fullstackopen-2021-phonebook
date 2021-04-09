const mongoose = require('mongoose')


if (process.argv.length < 3 ) {
    console.log('password as argument needed')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@cluster0.vdr7k.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, 
        required: true
    },
    number: {
        type: String,
        required: true
    }
})
const Person = mongoose.model('Person', personSchema)

console.log('length: ', process.argv.length)

if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook: ')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log('added', result.name, ' ', result.number, 'to phonebook')
        mongoose.connection.close()
    })
}