import API from "./client";

export const fetchCart = async () => {
  try {
    const response = await API.get(`carts/mine`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const addToCart = async (productId, qty) => {
  try {
    const response = await API.post(`carts/mine/items`, { productId, qty });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const response = await API.delete(`carts/mine/items/${cartItemId}`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const checkout = async (cartId, paymentInfo) => {
  try {
    const response = await API.post(`carts/mine/checkout`, {
      cartId,
      paymentInfo,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
