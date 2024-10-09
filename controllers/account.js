const Users = require("../models/users");
const argon2 = require("argon2");

class AccountController {
    static async login(req, res) {
        const user = await Users.select({ username: req.body.username });

        if (user && user.length > 0) {
            let ok = await argon2.verify(user[0].hashedPassword, req.body.password);
            res.json({ message: ok, user: user[0] });
        } else {
            res.status(401).json({ message: "Incorrect credentials" })
        }
    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ message: 'Error logging out' });
            } else {
                res.clearCookie('connect.sid');  // Supprime le cookie de session créé par Express côté client
                res.json({ message: 'Logout successful' });
            }
        });
    }

    static async checkSession(req, res) {
        if (req.session.user) {
            res.status(200).send({ user: req.session.user });
        } else {
            res.status(401).send({ message: 'Not authenticated' });
        }
    }

}

module.exports = AccountController;