var mongoose = require("mongoose");
var express = require('express');
var bodyParser = require("body-parser");

var app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/jetbrains");

var Product = mongoose.model("Product", {SalesTransaction: String, storeId: String});
var BackupProduct = mongoose.model("BackupProduct", {SalesTransaction: String, storeId: String});

var Schema = mongoose.Schema;

var salesTransactionSchema = new Schema({
    store_id: {type: String, required: true},
    timestamp: {type: Date, required: true},
    business_day: String,
    order_id: String,
    order_number: Number,
    order_opened_at: Date
});


//Merging 2 documents
var salesItemSchema = new Schema({
    itemName: String,
    itemNo: Number
});

var salesAmountSchema = new Schema({
    mrp: Number,
    currency: String
});

var salesItemsNAmountSchema = new Schema({
    itemName: String,
    itemNo: Number,
    mrp: Number,
    currency: String
});
var SalesItem = mongoose.model("SalesItem1", salesItemSchema);
var SalesAmount = mongoose.model("SalesAmount1", salesAmountSchema);
var SalesItemsNAmount = mongoose.model("SalesItemsNAmount1", salesItemsNAmountSchema);


app.get("/merge2Records", function (req, res) {
    var salesItems = [], salesAmount = [];
    //var si = new SalesItem({itemName: "Macbook", itemNo: 12});
    //si.save(function (err) {
    //});
    //var sa = new SalesAmount({mrp: 99000, currency: '$'});
    //sa.save();
    //var sni = new SalesItemsNAmount({itemName:"abc", itemNo:12,mrp:98,currency:"$"});
    //sni.save();
    SalesItem.find(function (err, items) {
        salesItems = items;
        if (err) {
            console.log("unable to merge")
        } else {
            console.log("Merged n Saved")
        }
    });
    SalesAmount.find(function (err, amount) {
        salesAmount = amount;
        if (err) {
            console.log("unable to merge")
        } else {
            for (var i = 0; i < salesItems.length; i++) {
                var salesItemsNAmount = new SalesItemsNAmount({
                    itemName: salesItems[i].itemName,
                    itemNo: salesItems[i].itemNo,
                    mrp: salesAmount[i].mrp,
                    currency: salesAmount[i].currency
                });
                salesItemsNAmount.save(function (err) {

                    if (err) {
                        console.log("unable to merge")
                    } else {
                        console.log("Merged n Saved")
                    }
                });
            }
            res.send();
        }
    });


});


//SalesTransaction - Creating Mongo Schema and using various attributes and data types
var SalesTransaction = mongoose.model('SalesTransaction', salesTransactionSchema);


app.get('/', function (req, res) {
    Product.find(function (err, products) {
        res.send(products);
    })
});
app.post('/add', function (req, res) {
    var newProd = req.body.name;
    var storeId = req.body.storeId;
    var product = new Product({SalesTransaction: newProd, storeId: storeId});
    product.save(function (err) {
        res.send();
        if (err) {
            console.log('failed');
        } else {
            console.log("saved")
        }
    });
});

app.get('/copy', function (req, res) {
    Product.find(function (err, products) {
        console.log(products);
        for (var i = 0; i < products.length; i++) {
            var backupProduct = new BackupProduct({
                SalesTransaction: products[i].SalesTransaction,
                storeId: products[i].storeId
            });
            setTimeout(save, 5000, backupProduct);
        }

        function save(backupProduct) {
            backupProduct.save(function (err) {
                res.send();
                if (err) {
                    console.log("failed to copy")
                } else {
                    console.log('Copied')
                }
            });
        }
    });
});
app.get('/getBackupData', function (req, res) {
    BackupProduct.find(function (err, products) {
        res.send(products);
    })
});


app.get('/fetchData', function (req, res) {
    SalesTransaction.find({}, function (err, trans) {
        for (var i = 0; i < trans.length; i++) {
            console.log(trans[i]);
        }
    });
});


app.post('/insertTransaction', function (req, res) {
    //insert after 20sec (20000 milliseconds) on arrival of dataset insert request
    setTimeout(saveRec, 2000);

    function saveRec() {
        //We can apply logic on input data and we can post to cloud, example is below
        var store_id = 'hotSchedule-' + req.body.a;
        var timestamp = req.body.b;
        var business_day = req.body.c;
        var order_id = req.body.d;
        var order_number = req.body.e;
        var order_opened_at = req.body.f;
        var salesTransaction = new SalesTransaction({
            store_id: store_id, timestamp: timestamp, business_day: business_day,
            order_id: order_id, order_number: order_number, order_opened_at: order_opened_at
        });
        salesTransaction.save(function (err) {
            res.send();
            if (err) {
                console.log("failed" + err);
            } else {
                console.log("inserted record");
            }
        });
    }
});
//Combile data from SalesTransaction and Product tables and insert into 3rd table
app.get('/combile2Tables', function (req, res) {
    SalesTransaction.find(function (err, salesTrans) {
        console.log(salesTrans);

    });
    Product.find(function (err, product) {
        console.log(product);
    });
    //var Any = new Schema({ any: {} });

    //Make it Array - 2 fields
});
app.listen(3000);


