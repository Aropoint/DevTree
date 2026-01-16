import server from './server';

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('El Servidor está funcionando en el puerto: ' + port)
})