import express from 'express';
import hbs from 'hbs';

const app = express();

app.set('view engine', 'html');
app.set('views', './build');

app.engine('html', hbs.__express);
app.use(express.static('build'));

app.get('*', function (req, res) {
  res.render('index', {});
});

app.listen(3002, function () {
  console.log('App started at http://localhost:3002/'); // eslint-disable-line no-console
});
