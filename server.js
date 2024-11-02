/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: __Rajesh Sah_________ Student ID: ___175281211____ Date: __2024__nov__31__
*
*
********************************************************************************/
const http = require('http');

const express = require('express');
const path = require('path'); 
const legoData = require('./modules/legoSets');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

 


// Configure EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Specify the directory for view templates
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize lego data and launch the server
legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running at http://localhost:${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Error initializing Lego data:", err);
    });


// Define the route for the home page
app.get('/', (req, res) => {
    res.render("home", { currentPage: '/' });
});

// Define the route for the about page
app.get('/about', (req, res) => {
    res.render("about", { currentPage: '/about' });
});

// Define the route for Lego sets with an optional theme parameter
app.get('/lego/sets', (req, res) => {
    const theme = req.query.theme;
    if (theme) {
        legoData.getSetsByTheme(theme)
            .then(data => {
                res.render('sets', { sets: data, theme, currentPage: '/lego/sets' });
            })
            .catch(err => {
                res.status(404).render('404', { currentPage: '', message: "No sets found for the specified theme." });
            });
    } else {
        legoData.getAllSets()
            .then(data => {
                res.render('sets', { sets: data, theme: null, currentPage: '/lego/sets' });
            })
            .catch(err => {
                res.status(500).render('500', { currentPage: '', message: "Error retrieving sets from the server." });
            });
    }
});

// Define the route for a specific Lego set by its set number
app.get('/lego/sets/:set_num', (req, res) => {
    res.status(404).render('404', { currentPage: '', message: "Details for this set are not available." });
});

// Fallback route to handle all other undefined routes with a 404 error
app.use((req, res) => {
    res.status(404).render('404', { currentPage: '', message: "Page not found." });
});
