import express from 'express';

const app = express();
app.use(express.static('dist/client/'));

app.get('/', function(req, res, next) {
    res.send('Express babr!');//render('index', { title: 'Express jaba baba' });
  });

app.listen(8080);