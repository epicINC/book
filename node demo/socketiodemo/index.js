const io = require('socket.io')()



io.use((socket, next) => {
	if (!socket.handshake.query.nick) return
	socket.nick = socket.handshake.query.nick
	next()
})

io.on('connection', socket => {



  socket.on('chat', msg => {
  	
    io.emit('chat', `
    	${socket.nick}: ${Date.now()}<br/>
    	${msg}
    `)
  })
})



io.listen(3000)