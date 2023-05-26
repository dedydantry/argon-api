const express = require('express')
const cors = require('cors')
const router = require('./routes/api')
const http = require('http');
const { Server } = require("socket.io")
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
})
const PORT = process.env.APP_PORT ? process.env.APP_PORT : 8080
const HOST = process.env.APP_HOST ? process.env.APP_HOST : 'localhost'
app.use(express.static('storage'));
app.use(cors())
app.use(express.json())
app.use((req,res,next) => {
  req.io = io
  next()
})
app.use('/api', router)

io.on('connection', (socket) => {
  socket.on('profil change', (msg) => {
    io.emit('notif-profil', msg);
  })
})

server.listen(PORT, () => {
  console.log(`App listening at http://${HOST}:${PORT}`)
})