var express = require("express");
var router = express.Router();

// Recive Original URL and return URL shortened
router.post("/shorturl/new", (req, res) => {
  console.log(req.body);
  res.json({ original_url: req.body.url, short_url: 1 });
});

// ShortURL Redirect
router.get("/shorturl/:id", (req, res) => {
  const { id } = req.query;

  // Find the shortURL
  res.json({ error: "No short url" });
});

module.exports = router;
