import { createServer } from 'http';

export const runServer = () => {
    createServer((req, res) => {
        res.writeHead(200, 'You should not be here.');
        res.end('Why are you still here?', 'utf-8'); 
    }).listen(process.env.PORT);
};