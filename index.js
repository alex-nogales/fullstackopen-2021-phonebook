require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('test', (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :test'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

/* 
let persons = [ 
    {
        id: 1,
        name: "Alex Nogales",
        number: 123456
    },
    {
        id: 2,
        name: "Fabiola Concha",
        number: 43215
    },
    {
        id: 3,
        name: "Blitz Mithrandir",
        number: 666
    }
] */

//Utiities
const generateId = max => {
    return Math.floor(Math.random() * max)
}

//root
app.get('/', (request, response) => {
    response.send('<h1>Phonebook on backend!</h1>')
})


//api/persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id )
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'Name or number are missing!'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(result => {
        persons = persons.concat(person)
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//info
app.get('/info', (request, response) => {
    timestamp = new Date()
    personLength = persons.length

    response.send(`<p>Phonebook has info of ${personLength} persons</p><p>${timestamp}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App running on localhost:3001')
})

app.use(errorHandler)