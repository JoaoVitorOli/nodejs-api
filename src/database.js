import fs from 'node:fs/promises'

export const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = []

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(search) {
    let data = this.#database

    if (search) {
      const rowIndex = this.#database.findIndex(row => row.id === search)

      if (rowIndex > -1) {
        // this.#database[rowIndex] = { 
        //   id: search, 
        //   title: this.#database[rowIndex].title,
        //   description: this.#database[rowIndex].description,
        //   updated_at: this.#database[rowIndex].updated_at,
        //   completed_at: this.#database[rowIndex].completed_at ? true : false,
        //   created_at: this.#database[rowIndex].created_at
        // }
  
        // this.#persist()

        return this.#database[rowIndex]
      }
    }

    return data
  }

  insert(data) {
    this.#database.push(data)

    this.#persist()

    return data
  }

  update(id, data) {
    const rowIndex = this.#database.findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[rowIndex] = { 
        id, 
        title: data.title,
        description: data.description,
        updated_at: data.updated_at,
        completed_at: data.completed_at,
        created_at: this.#database[rowIndex].created_at
      }

      this.#persist()
    }
  }

  delete(id) {
    const rowIndex = this.#database.findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database.splice(rowIndex, 1)
      this.#persist()
    }
  }
}