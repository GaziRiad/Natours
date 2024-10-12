const mongoose = require("mongoose");

const tourShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  difficulty: String,
});

const Tour = mongoose.model("Tour", tourShema);

module.exports = Tour;
