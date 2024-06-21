export const sendMessageServer = (cred: any) => {

  cred.on('chat message', () => {
    cred.broadcast.emit('chat message', cred);
  });
}
