const createError = require("http-errors");
const CartModel = require("../models/cart");
const OrderModel = require("../models/order");
const CartItemModel = require("../models/cartItem");

const { STRIPE_SECRET_KEY } = require("../config");

module.exports = class CartService {
  async create(data) {
    const { userId } = data;

    try {
      const Cart = new CartModel();
      const cart = await Cart.create(userId);

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async loadCart(userId) {
    try {
      const cart = await CartModel.findOneByUser(userId);

      const items = await CartItemModel.find(cart.id);
      cart.items = items;

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async addItem(userId, item) {
    try {
      const cart = await CartModel.findOneByUser(userId);

      const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      const cartItem = await CartItemModel.delete(cartItemId);

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async updateItem(cartItemId, data) {
    try {
      const cartItem = await CartItemModel.update(cartItemId, data);

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {
      const stripe = require("stripe")(STRIPE_SECRET_KEY);

      const cartItems = await CartItemModel.find(cartId);

      const total = cartItems.reduce((total, item) => {
        return (total += Number(item.price));
      }, 0);

      const Order = new OrderModel({ total, userId });
      Order.addItems(cartItems);
      await Order.create();

      await stripe.charges.create({
        amount: total,
        currency: "usd",
        source: paymentInfo.id,
        description: "Charge",
      });

      const order = Order.update({ status: "COMPLETE" });

      return order;
    } catch (err) {
      throw err;
    }
  }
};
