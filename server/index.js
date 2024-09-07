'use strict';
const app = require('./app');
const port = 3800;

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/red_social_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false 
})
.then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`); 
    });
})
.catch(err => console.error('Database connection error:', err));
