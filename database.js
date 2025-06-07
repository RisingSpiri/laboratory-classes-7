const { MongoClient } = require("mongodb");
const { DB_USER, DB_PASS } = require("./config");

let database;

const mongoConnect = (callback) => {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.XYZ.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  MongoClient.connect(uri)
    .then(client => {
      console.log("Connection to the database has been established.");
      database = client.db("shop");
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

module.exports = { mongoConnect };
