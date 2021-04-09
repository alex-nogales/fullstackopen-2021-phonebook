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
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
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
    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(formattedPerson => {
            response.json(formattedPerson)
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body 

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true
    })
      .then(updatedPerson => {
          if(updatedPerson) {
              response.json(updatedPerson.toJSON())
          } else {
              response.status(404).end()
          }
      })
      .catch(error => next(error))

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
    Person.estimatedDocumentCount({})
        .then( count => {
            const message = 
            `<p>Phonebook has info of ${count} persons<p>` + 
            `<p>${timestamp}</p>`
            response.send(message)
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App running on localhost:3001')
})

app.use(errorHandler)