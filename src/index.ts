import colors from 'colors';
import server from './server';

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(colors.blue.bold('El Servidor está funcionando en el puerto: ' + port))
})

