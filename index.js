const express = require('express');
const app = express();
const path = require('path')
const methodOverride = require('method-override')
// const session = require('express-session')
const mysql2 = require('mysql2');
const uuid = require('uuid');


// DB Connection
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Divyush123',
    database: 'rental'
  });
  
  db.connect((error) => {
    if (error) {
      console.error('Error connecting to database: ', error);
    } else {
      console.log('Connected to database successfully!');
    }
  });


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// app.use(session({secret: 'notagoodsecret'}))

app.listen("3000", (req, res) => {
    console.log("Listening on port 3000")
})

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/signin', (req, res) => {
    res.render("signup.ejs");
})

app.post('/signup', (req, res) => {

    const { name, email, password, confirmpassword } = req.body

    db.query('SELECT email FROM rental.user WHERE email = ?', [email], (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results && results.length > 0){
            return res.render('signup', {    message: 'That email is already in use' })
            
        }
        else if( password != confirmpassword)
        {
            return res.render('signup', {
               message: 'Password do not match'
           })
        }
        
        db.query('INSERT INTO rental.user SET ?', {name: name ,  email: email, password: password});
       // req.session.user_id=results[0].id;
       // req.session.user_name=results[0].name
        res.redirect('/') 
        
        });

//    return res.redirect('/signin')
})

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        var sql = 'SELECT * FROM rental.user WHERE email =? AND password =?';
        db.query(sql, [email, password], function (err, results, fields) {
    
            if (err) {
              console.log(err);
            }

            if (results && results.length > 0) {
              //  req.session.user_id=results[0].id;
              //  req.session.user_name=results[0].name
                // request.session.loggedin = true;
				// request.session.username = username;
              return res.redirect('/');    
            }
            else {   
             return res.render('signup', { message:'Your Email Address or Password is wrong '});
            }
        })
    }
})

app.post('/signout', (req,res)=>{
    //   req.session.user_id = null;
    //   req.session.user_name = null;
      res.redirect('/signin')
})

//  admin login

app.get('/adminsignin', (req,res)=>{
    res.render('adminsignin.ejs')
})

app.post('/adminsignin', (req,res)=>{
    const { email, password } = req.body;

    if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        var sql = 'SELECT * FROM rental.admin WHERE email =? AND password =?';
        db.query(sql, [email, password], function (err, results, fields) {
    
            if (err) {
              console.log(err);
            }

            if (results && results.length > 0) {
                
                //req.session.user_id=results[0].id;
               res.redirect('/admin/admindashboard');
               
            }
            else {
              
             return res.render('adminsignin', { message:'Your Email Address or Password is wrong '});
            }
        })
    }

})

app.get('/admin/admindashboard', (req,res)=>{
    let totalOrders=0;

    db.query('SELECT * FROM rental.orders', (error, orders) =>{
        if(error){
            console.log(error);
        }

        if(orders.length > 0){
            for(let order of orders ){
                
                if(order){
                    totalOrders++;
                }
            }

             
           return res.render('admindashboard.ejs', {totalOrders, orders})
        }
        res.render('admindashboard.ejs')
     })
    
})

app.get('/admin/customers', (req,res)=>{
    
    db.query('SELECT * FROM rental.user', (error, customers) =>{
        if(error){
            console.log(error);
        }

        if(customers.length > 0){
            return res.render('customers.ejs', { customers })  ;
        }
        else{

            res.render('customers.ejs');
        }
    });
})

app.get('/admin/orders', (req,res)=>{
    db.query('SELECT * FROM rental.orders', (error, orders) =>{
        if(error){
            console.log(error);
        }

        if(orders.length > 0){
            return res.render('orders.ejs', { orders })  ;
        }
        else{

            res.render('orders.ejs')
        }
    });
    
})

app.get('/admin/addproduct', (req,res)=>{
    res.render('addProduct.ejs')
})

app.post('/admin/addproduct', (req,res)=>{
    const{title, price, quantity, imageurl, category, product_type }= req.body;
    const productId = uuid.v4();
    db.query('INSERT INTO rental.products SET ?', { id:productId, title:title , price:price, quantity: quantity, imageurl:imageurl, category:category, product_type:product_type});

    res.redirect('/admin/admindashboard');
})

app.get('/admin/deleteproduct', (req,res)=>{
    
    db.query('SELECT * FROM rental.products', (error, products) =>{
        if(error){
            console.log(error);
        }

        if(products.length > 0){
            return res.render('delete.ejs', { products })  ;
        }
        else{

            res.render('delete.ejs');
        }
    });
   
})

app.delete('/admin/deleteproduct/:id', (req,res)=>{
    const{id}= req.params;
    
    
  db.query(`DELETE FROM rental.products WHERE id ='${id}'`, function (err, result) {
    if (err) throw err;

    res.redirect('/admin/deleteproduct');
  });

})

app.post('/admin/signout', (req,res)=>{
   // req.session.user_id = null;
    res.redirect('/adminsignin');
})

/////////////////////////////////////


app.get('/appliances', (req, res) => {
    db.query("SELECT * FROM rental.products WHERE category = 'appliances'", function (err, products, fields) {
        if (err) throw err;
        res.render('appliances.ejs',{ products });
      });
})

app.get('/electronics', (req,res)=>{

    db.query("SELECT * FROM rental.products WHERE category = 'electronics'", function (err, products, fields) {
        if (err) throw err;
        res.render('electronics.ejs',{ products });
      });
})

app.get('/watch', (req,res)=>{
    res.render('watch.ejs')
})

app.get('/category', (req,res)=>{
    res.render('category.ejs');
})

app.post('/rentnow', (req,res)=>{
    const{product_name, product_price, product_imageurl}=req.body;
    res.render('payment.ejs',{product_name, product_price, product_imageurl});
})

app.post('/book', (req,res)=>{
   const { customer_name, customer_email, customer_number, customer_address, city, state, pincode, price, product_name, date, month} = req.body;
   res.render('card.ejs',{ customer_name, customer_email, customer_number, customer_address, city, state, pincode, price, product_name, date, month})

})

app.post('/paymentsuccessfull', (req,res)=>{
    const { customer_name, customer_email, customer_number, customer_address, city, state, pincode, price, product_name, date, month} = req.body;

    db.query('INSERT INTO rental.orders SET ?', {customer_name:customer_name, customer_email:customer_email, customer_number:customer_number, customer_address:customer_address, city:city, state:state, pincode:pincode, price:price, product_name:product_name, date:date, month:month  });


    res.render('booksuccess.ejs');
})


