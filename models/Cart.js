const { getDatabase } = require("../database");
const Product = require("./Product");
const COLLECTION_NAME = "carts";

class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = [];
  }

  static async add(userId, productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);
    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    let cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    if (!cart) {
      cart = {
        userId,
        items: [{ productName: product.name, quantity: 1 }]
      };
      await db.collection(COLLECTION_NAME).insertOne(cart);
      return;
    }

    const itemIndex = cart.items.findIndex(item => item.productName === product.name);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productName: product.name, quantity: 1 });
    }
    await db.collection(COLLECTION_NAME).updateOne(
      { userId },
      { $set: { items: cart.items } }
    );
  }

  static fetchAll() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static async getCart(userId) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ userId });
  }

  static async getProductsQuantity(userId) {
    const cart = await Cart.getCart(userId);
    if (!cart || !cart.items.length) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice(userId) {
    const db = getDatabase();
    const cart = await Cart.getCart(userId);
    if (!cart || !cart.items.length) return 0;
    let sum = 0;
    for (const item of cart.items) {
      const product = await Product.findByName(item.productName);
      if (product) {
        sum += product.price * item.quantity;
      }
    }
    return sum;
  }

  static async clearCart(userId) {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).updateOne(
      { userId },
      { $set: { items: [] } }
    );
  }
}

module.exports = Cart;
