const express = require("express")
const cors = require('cors');
const app = express() 

app.use(cors());
app.use(express.json());

app.post("/api/upload", (req, res) => {
    console.log(req.body)
    res.json({ success: true })
})

app.listen(3000, () => console.log("goon"))