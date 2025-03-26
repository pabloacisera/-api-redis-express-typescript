import express from 'express'
import { envs } from './configuration/environments'

const port = envs.PORT

const app = express()

app.listen(port, () => {
  console.log(`🖥️ Server running on: http://localhost:${port}`)
})