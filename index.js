const express = require('express');
const hbs = require('hbs');

const app = express();

app.use(express.urlencoded({
    extended: false
}))
app.set("view engine", "hbs");

const database = [
    {
        "id" : 1,
        "title" : "Barely Used PS5",
        "price" : 675.50,
        "payment" : ["cod", "paynow"],
        "type" : "entertainment"
    },
    {
        "id" : 2,
        "title" : "Used Caculus Textbok",
        "price" : 69.90,
        "payment" : ["paynow"],
        "type" : "education"
    },
    {
        "id" : 3,
        "title" : "New Oxdog hyperlight Hes 26 floorball stick",
        "price" : 167.50,
        "payment" : ["cod", "paynow","cheque"],
        "type" : "sports"
    }
]


app.get("/", function(req,res){
    res.render("index", {
        'products': database
    });
});

app.get("/create-listing", function(req,res){
    res.render("createlisting");
});

app.post("/create-listing", function(req,res){
    const title = req.body.title;
    const price = req.body.price;
    let payments = [];
    if(Array.isArray(req.body.payments))
        payments = req.body.payments;
    else if(req.body.payments)
        payments = [req.body.payments];
    const type =  req.body.type;
    const newListing = {
        "id" : Math.floor(Math.random() * 10000 + 1),
        "title" : title,
        "price" : price,
        "payment" : payments,
        "type" : type
    }
    database.push(newListing);
    res.redirect("/");
    // res.send("form recieved")
});

app.listen(3000, function () {
    console.log("Server has started");
})