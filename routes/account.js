const express = require("express");
const AccountController = require("../controllers/account");

const accountRouter = express.Router();

// Les données reçues dans les requêtes POST sont converties en JSON
accountRouter.use(express.json());

// Routes
accountRouter.post("/login", AccountController.login);
accountRouter.post("/logout", AccountController.logout);
accountRouter.get("/check-session", AccountController.checkSession);

module.exports = accountRouter;