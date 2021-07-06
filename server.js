//modules and packages
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');

require('dotenv').config();

//New sequelize store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const port = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

//configure and link a session object with sequelize store
const sess = {
    secret: 'secret session',
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

//add express-session and store as express.js middleware
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use(routes);

sequelize.sync({ force:false }).then(() => {
    app.listen(port, () => console.log(`Now listening on port ${port}`))
});