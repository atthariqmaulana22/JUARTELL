const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

// Redirect to https
app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && env !== 'development') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

const server = require('http').createServer(app);
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

/**
 * Socket.io events
 */
const io = socketIO(server);
io.sockets.on('connection', function (socket) {
    /**
     * Log actions to the client
     */
    function log() {
        const array = ['Server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

});
