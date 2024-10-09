const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require("./database");

const accountRoutes = require("./routes/account");
const campaignRoutes = require("./routes/campaigns");

// Middleware pour gérer les requêtes JSON et le CORS
app.use("/", bodyParser.json());

// CORS
app.use("/", cors({
    origin: '*', // Le frontend tourne sur localhost:3000
    credentials: true,
}));

// Configurer la session
const sessionStore = new MySQLStore({}, pool);
app.use("/", session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 10, // 10 secondes

        // pour une connexion HTTP simple
        secure: process.env.HTTPS,
        httpOnly: !process.env.HTTPS
    }
}));

// Temps de latence fictif
if (process.env.NODE_ENV == "development") {
    app.use("/", (req, res, next) => {
        setTimeout(next, process.env.FAKE_API_LATENCY);
    });
}

// Routes
app.use("/account", accountRoutes);
app.use("/campaigns", campaignRoutes);

// Démarrer le serveur
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});