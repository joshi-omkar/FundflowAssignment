const express = require("express");
const Item = require("./model/itemModel");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const cors = require("cors");
const allowedOrigins = ["<http://localhost:4200>"];

app.use(cors());

mongoose.connect(
  "mongodb+srv://omkar:omkar@cluster0.pdwirp0.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// GET /items - Retrieve a list of items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /items/:id - Retrieve a specific item
app.get("/items/:id", getItem, (req, res) => {
  res.json(res.item);
});

// POST /items - Add a new item
app.post("/items", async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    sku: req.body.sku,
    supplier: req.body.supplier,
    delivered: req.body.delivered,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /items/:id - Update an existing item
app.put("/items/:id", getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.price != null) {
    res.item.price = req.body.price;
  }
  if (req.body.stock != null) {
    res.item.stock = req.body.stock;
  }
  if (req.body.sku != null) {
    res.item.sku = req.body.sku;
  }
  if (req.body.supplier != null) {
    res.item.supplier = req.body.supplier;
  }
  if (req.body.delivered != null) {
    res.item.delivered = req.body.delivered;
  }
  if (req.body.imageUrl != null) {
    res.item.imageUrl = req.body.imageUrl;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /items/:id - Delete an item
// app.delete("/items/:id", getItem, async (req, res) => {
//   try {
//     console.log(typeof(res.item))
//     await res.item.remove();
//     res.json({ message: "Item deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.delete("/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndRemove(itemId);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getItem(req, res, next) {
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.item = item;
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
