const { response } = require('express')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')



const app = express()
app.use(cors())

app.use(bodyParser.json())


morgan.token('person', (req) => {
    if (req.method === 'POST') return JSON.stringify(req.body)
    return null
  })

  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms :person',
    ),
  )

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }

]

const today = new Date().toString()
const phonebookLength = persons.length

app.get('/info', (request, response) => {
    response.send(`<div>
    <span>Phonebook has info for ${phonebookLength} people</span></div>
  <span>${today}</span>`,)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id
    )
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
   persons = persons.filter(person => person.id !== id
    )
    response.status(204).end()


})


const generateId =() => Math.floor(Math.random() * 100000000)


app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name && body.name === "") {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number && body.number === "") {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const existing = persons.find(person => body.name === person.name)

    if (existing) {
        return response.status(400).json({
            error: 'name already exists in the phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

