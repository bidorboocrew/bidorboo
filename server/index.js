const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({
    hi: "hey there"
  });
});


console.log('I made it ssssssssssssssss' + process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT);
