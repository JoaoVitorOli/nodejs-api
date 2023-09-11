import express from 'express'
import { randomUUID } from 'node:crypto'
import { generateCsv } from './convertToCsv.js'

import { Database } from './database.js'

const app = express();
app.use(express.json())

const database = new Database()

app.post('/tasks', (req, res) => {
  const { title, description } = req.body

  database.insert({
    id: randomUUID(),
    title,
    description,
    completed_at: null,
    created_at: Date.now(),
    updated_at: Date.now(),
  })

  res.json(req.body)
})

app.get('/tasks', (req, res) => {
  const data = database.select();

  res.json(data)
})

app.put('/tasks/:id', (req, res) => {
  const { title, description } = req.body
  const { id } = req.params

  const data = database.select()

  database.update(id, {
    title: title ? title : data.title, 
    description: description ? description : data.description,
    completed_at: data.completed_at,
    updated_at: Date.now(),
  })

  res.json(req.body)
})

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params

  database.delete(id)

  res.json(id)
})

app.patch('/tasks/:id/complete', (req, res) => {
  const { id } = req.params

  const task = database.select(id)

  database.update(id, {
    id: task.id,
    title: task.title,
    description: task.description,
    completed_at: task.completed_at ? null : Date.now(),
    created_at: task.created_at,
    updated_at: Date.now()
  })

  res.json(id)
})

app.listen(3333, () => {
  console.log('Project listen to port 3333 👌')
  generateCsv();
})