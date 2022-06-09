const express = require("express");
const router = express.Router();

const AuthService = require("../services/AuthService");
const AuthServiceInstance = new AuthService();

const CartService = require("../services/CartService");
const CartServiceInstance = new CartService();

const UserService = require("../services/UserService");
const UserServiceInstance = new UserService();

module.exports = (app, passport) => {
  app.use("/api/auth", router);

  router.post("/register", async (req, res, next) => {
    try {
      const data = req.body;

      const response = await AuthServiceInstance.register(data);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const { username, password } = req.body;

        const response = await AuthServiceInstance.login({
          email: username,
          password,
        });

        res.status(200).send(response);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      res.redirect("/");
    }
  );

  router.get("/facebook", passport.authenticate("facebook"));

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    async (req, res) => {
      res.redirect("/");
    }
  );

  router.get("/logged_in", async (req, res, next) => {
    try {
      const { id } = req.user;

      const cart = await CartServiceInstance.loadCart(id);
      const user = await UserServiceInstance.get({ id });

      res.status(200).send({
        cart,
        loggedIn: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  });
};
