const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

let people = [
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
];

app.use(express.static('build'))
app.use(cors());
app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Wow...this works</h1>')
});

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${people.length} people<br>${new Date()}`;
  response.send(info);
});

app.get('/api/people', (request, response) => {
  response.json(people);
});

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find(person => person.id === id)

  person ? response.json(person) : response.status(404).end();
});

const generateId = () => {
  const maxId = people.length > 0
    ? Math.max(...people.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/people/', (request, response) => {
  const body = request.body;

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    });
  }

  if(people.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    });
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  people = [...people, person];

  response.json(person);
});

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter(person => person.id !== id);

  response.status(204).end();
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
