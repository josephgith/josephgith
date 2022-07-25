const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://jptech:jptech@cluster0.bvkthke.mongodb.net/?retryWrites=true&w=majority",
  () => console.log("connected successfully"),
  (err) => console.log(err)
);
