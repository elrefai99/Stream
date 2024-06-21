import 'dotenv/config'
import express, { Application, Response } from "express";
import { ServerStreamingFunction } from "../Config/Streaming";
import * as http from 'http'
import * as io from 'socket.io'
import { disconnectServer } from '../providers/Socket/disConnect.socket';
import { sendMessageServer } from '../providers/Socket/message.socket';
import SystemSetUp from '../utils/SystemSetUp';

const app: Application = express()
export const server = http.createServer(app)
const ioSocket = new io.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

ioSocket.on('connection', (cred) => {
  sendMessageServer(cred)
  disconnectServer(cred)
})
ServerStreamingFunction()

SystemSetUp(app)

app.get('/', (_req, res: Response) => {
  res.status(200).render('pages/HomePage');
});

server.listen(process.env.PORT, () => {
  console.log('Main server API running success in: ', process.env.server_link)
})
