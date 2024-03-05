const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const handlebarshelpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
});

const app = express();

app.use(express.urlencoded({
    extended: false
}))
app.set("view engine", "hbs");

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const database = [
    {
        "id" : 1,
        "title" : "Barely Used PS5",
        "price" : 675.50,
        "payment" : ["cod", "paynow"],
        "type" : {
            type : "entertainment",
            value : "entertainment"
        }
    },
    {
        "id" : 2,
        "title" : "Used Caculus Textbok",
        "price" : 69.90,
        "payment" : ["paynow"],
        "type" : {
            type : "education",
            value : "education"
        }
    },
    {
        "id" : 3,
        "title" : "New Oxdog hyperlight Hes 26 floorball stick",
        "price" : 167.50,
        "payment" : ["cod", "paynow","cheque"],
        "type" : {
            type : "sports",
            value : "sports"
        }
    }
]


app.get("/", function(req,res){
    console.log(database);
    res.render("index", {
        'products': database
    });
});

app.get("/create-listing", function(req,res){
    res.render("createlisting");
});

app.post("/create-listing", function(req,res){
    console.log(req.body);
    const title = req.body.title;
    const price = req.body.price;
    let payments = [];
    if(Array.isArray(req.body.payments))
        payments = req.body.payments;
    else if(req.body.payments)
        payments = [req.body.payments];
    let type =  req.body.type;
    if(req.body.type == "others")
    {
        type = {
            type : req.body.type,
            value : req.body.othertype
        };
    }
    else
    {
        type = {
            type : req.body.type,
            value : req.body.type
        };
    }
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

app.get("/delete-listing/:listingid", function(req,res){
    console.log(req.params);
    const idtodel = req.params.listingid;
    delListing = null;
    for(let l of database)
    {
        if(l.id == idtodel)
        {
            delListing = l;
            break;
        }
    }
    if(delListing != null)
        res.render('confirm-delete',{
            "record" : delListing
    });
});

app.post("/delete-listing/:listingid", function(req,res){
    const idtodel = req.params.listingid;
    let indextodel = -1;
    for(let i = 0; i < database.length; i++)
    {
        if(database[i].id == idtodel)
        {
            indextodel = i;
            break;
        }
    }
    if(indextodel != -1)
    {
        database.splice(indextodel,1);
    }
    res.redirect('/');
});

app.get("/edit-listing/:listingid", function(req,res){
    const idtoedit = req.params.listingid;
    const listingToEdit = database.find(function(record) { 
        return record.id == idtoedit;
    });
    res.render('editlisting',{
        record : listingToEdit
    });
});

app.post("/edit-listing/:listingid", function(req,res){
    const idtoedit = req.params.listingid;
    const listingIDToEdit = database.findIndex(function(record) { 
        return record.id == idtoedit;
    });
    let payments = [];
    if(Array.isArray(req.body.payments))
        payments = req.body.payments;
    else if(req.body.payments)
        payments = [req.body.payments];
    let type =  req.body.type;
    if(req.body.type == "others")
        {
            type = {
                type : req.body.type,
                value : req.body.othertype
            };
        }
        else
        {
            type = {
                type : req.body.type,
                value : req.body.type
            };
        }
    const modifiedListing = {
        "id" :  idtoedit,
        "title" : req.body.title,
        "price" : req.body.price,
        "payment" : payments,
        "type" : type
    };
    database[listingIDToEdit] = modifiedListing;
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server has started");
});