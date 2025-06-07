const { getDatabase } = require("../database");
const COLLECTION_NAME = "products";

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name: this.name })
      .then(existing => {
        if (existing) {
          throw new Error("Product already exists");
        }
        return db.collection(COLLECTION_NAME).insertOne({
          name: this.name,
          description: this.description,
          price: this.price
        });
      });
  }

  static fetchAll() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name });
  }

  static deleteByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteOne({ name });
  }

  static async getLast() {
    const db = getDatabase();
    const last = await db.collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    return last[0] || null;
  }
}

module.exports = Product;
