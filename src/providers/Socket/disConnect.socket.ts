export const disconnectServer = (cred: any) => {
  cred.on('disconnect', () => {
    console.log(`user ${cred.id} left.`)
  })
}
