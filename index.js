/*
console.log('hello world')
const http=require('http')

  const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
  })


const PORT=3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
*/

const express=require('express')
const app=express()

app.use(express.json())  //express json-parser 

let notes = [  //note this is an array of objects
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]
app.get('/', (req,res)=>{
    res.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (req, res)=>{
    res.json(notes)
})

const PORT=3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/notes/:id', (req, res)=>{
    const id = Number(req.params.id)  //note need to turn this to a num to match === below
    console.log(id)
    const note = notes.find(note=> note.id === id)
    if (note){
        res.json(note)
    }else {
        res.status(404).end()   //404 means not found
    }
})

app.delete('/api/notes/:id', (req, res)=>{   //for deleting resources -> HTTP delete request
    const id = Number(req.params.id)
    notes = notes.filter(note=>note.id!==id)

    res.status(204).end()   //204 means no content but can be 404 alternatively here.
})

/*
app.post('api/notes', (req, res)=>{  //initial handler
    const note = req.body  //without the json-parser from above, this data from the body property would be undefined, but the parser makes it a JS object and then attaches it to the body property
    console.log(note)
    req.json(note)
})
*/
/*
app.post('/api/notes', (req, res)=>{
    const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0  //this gives the max ID number

    const note = req.body
    note.id = maxID + 1

    notes = notes.concat(note)

    res.json(note)
})
*/

const generateId = () =>{
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0  //this gives the max ID number. how it works is this: first it does map method on notes to create an array of all ids of notes, then b.c Math.max only works on a single num, we have to use the spread operator to spread it out, then it takes the max and returns it, or else 0
    return maxId + 1
}

app.post('/api/notes', (req, res)=>{
    const body = req.body
    if (!body.content){
        return res.status(400).json({ //400 is bad request. note the return is important
            error: 'content missing'
        })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),  //good practice to generate timestamp on server over browser 
        id: generateId()
    }
    notes = notes.concat(note)
    res.json(note)
})

