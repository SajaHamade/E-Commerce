const port = 4000;
const express = require ("express");
const app= express();
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");


app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://Saja:Hamade@todolist.805ge.mongodb.net/ECommerce?retryWrites=true&w=majority&appName=ToDoList") 

app.listen(port,(error)=>{
    if(!error) {
        console.log("Server is Running on " +port)
    }
    else{
        console.log("Error:"+error)
    }
})






app.get("/",(req,res)=>{
res.send("Express App is Running");
})


//I want to store the uploaded image in the upload folder using ulter 

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
    
})


const upload = multer({storage:storage})


app.use('/images',express.static('upload/images')) //using this you an access images via url : http://yourdomain.com/images/profilePic_123.jpg


//Uploading images via endpoint 

app.post("/upload",upload.single('product'),(req,res)=>{
     res.json ({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
}) 


//Now , instead of putting this in a separate page model and exporting this model , i will define the schema here :

const Product = mongoose.model("Product",{
    id:{
       type: Number ,
       required: true , 
    },

    name :{
        type: String,
        required: true,
    },

    image:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },

    new_price:{
        type:Number,
        required:true,
    },

    old_price:{
        type:Number,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now,
    },

    available:{
        type:Boolean,
        default:true,
    },
 
})


app.post('/addproduct',async (req,res) => {
    //we re using the Product Schema
    let products = await Product.find({}); //this is to put all  what is in the db in the products array
    let id ;
    if(products.length>0){
        let last_product_array = products.slice(-1); //slice returns the last element of the array
        let last_product = last_product_array[0]; //since slice returns an array of one element so we access it through [0]
        id = last_product.id + 1;
    }
    else {
        id = 1; //the first thing to be added 
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        old_price:req.body.old_price,
        new_price:req.body.new_price,
   
    });

    console.log(product);

    await product.save();//product saved in the database

    console.log("Saved");
   res.json({
        success:true,
        name:req.body.name,
        image:req.body.image
    })
})



app.post('/removeproduct', async (req,res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    return res.json({
        success: true,
        name:req.body.name
    })
})



app.get('/allproducts', async (req,res)=> {
let products = await Product.find({});
console.log("All products fetched");
return res.send(products);

})




//Creating User Schema

const User = mongoose.model('Users', { 
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, // Refers to the Product _id in Product collection
                ref: 'Product',
            },
            name: {
                type: String, // Name of the product
                required: true,
            },
          
            category: {
                type: String, 
                required: true,
            },
            image:{
                type:String,
                required:true,
            },
           price: {
                type: Number,
                required: true,
            },
           
            size: {
                type: String, 
                required: true,
            },
            quantity: {
                type: Number, // Quantity of the product in the cart
                default: 0,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});



app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "email already used" });
    }
 

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: []
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom');
    return res.json({ success: true, token }); // Added return
});

app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = { user: { id: user.id } };
            const token = jwt.sign(data, 'secret_ecom');
            return res.json({ success: true, token }); // Added return
        } else {
            return res.json({ success: false, errors: "Wrong Password" }); // Added return
        }
    }
    return res.json({ success: false, errors: "Wrong Email" }); // Added return
});

app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    if (products.length === 0) {
        return res.json({ success: false, message: "No products found" });
    }
    let newcollection = products.slice(1).slice(-8);
    return res.send(newcollection); // Added return
});


app.get('/popularinwomen',async(req,res)=>{
    let products = await  Product.find({category:"women"});
    if (products.length === 0) {
        return res.json({ success: false, message: "No products found" });
    }
    let popular_in_women = products.slice(0,4);
    console.log("Populaar in women fetched " );
   return res.send(popular_in_women);

})


const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token) ;
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom'); 
        req.user = data.user; 
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(401).send({ errors: "the catch block" });
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const { productId, size } = req.body;

        console.log("Received productId:", productId, "size:", size);

        
        if (!productId || !size) {
            return res.status(400).json({ success: false, error: "Missing productId or size" });
        }

      
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        let addedproduct = await Product.findOne({id:productId});
        if (!addedproduct) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        // Check if the item already exists in the cart
        const existingItemIndex = userData.cartData.findIndex(
            (item) => item.productId.toString() === addedproduct._id.toString() && item.size === size
        );

        if (existingItemIndex > -1) {
            // If item exists, update its quantity
            userData.cartData[existingItemIndex].quantity += 1;
        } else {
            // Otherwise, add a new item to the cart
            userData.cartData.push({
                productId:addedproduct._id,
                size,
                quantity: 1,
                image:addedproduct.image,
                price: addedproduct.new_price,
                category: addedproduct.category,
                name:addedproduct.name
            });
        }

        // Save changes to DB
        await userData.save();

        // Respond to client
        return res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});



app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const { productId, size } = req.body;

        console.log("Received productId:", productId, "size:", size);
        // Validate input
        if (!productId || !size) {
            return res.status(400).json({ success: false, error: "Missing productId or size" });
        }

        // Fetch user data from DB
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }


        let productToBeRemoved = await Product.findOne({_id:productId});
        if (!productToBeRemoved) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        // Check if the item exists in the cart
        const existingItemIndex = userData.cartData.findIndex(
            (item) => item.productId.toString() === productToBeRemoved._id.toString() && item.size === size
        );
        

        if (existingItemIndex > -1) {
            
                // remove the item from the cart
                userData.cartData.splice(existingItemIndex, 1);
            }
         else {
            return res.status(404).json({ success: false, error: "Item not found in cart" });
        }

        await userData.save();

        return res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});





app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

       
        return res.json(userData.cartData);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});


//PROMOCODE and Checkout 





const PromoCode = mongoose.model("Promocode",{
      name :{
        type: String,
        unique: true,
        required: true,
    },
    discount:{
       type: Number ,
       required: true , 
    }

} );



app.post('/addpromo',async (req,res) => {
  
    const code = await PromoCode.findOne({ name: req.body.name });
    if (code) {
        return res.status(404).json({ success: false, error: "PromoCode exists" });
    } 

    const promo = new PromoCode({
       
        name:req.body.name,
        discount:req.body.discount

    });

 

    console.log(promo);

    await promo.save();

    console.log("PromoCode Saved");
    res.json({
        success:true,
        name:req.body.name
    })
})



app.post('/removepromo', async (req, res) => {
    const { name } = req.body; 

console.log(name);
    try {
        const promo = await PromoCode.findOneAndDelete({name});
        if (promo) {
            console.log("PromoCode Removed:", promo);
           return res.json({
                success: true,
                name
            });
        } else {
            return res.status(404).json({ success: false, message: "PromoCode not found" });
        }
    } catch (error) {
        console.error("Error removing PromoCode:", error);
       return res.status(500).json({ success: false, message: "Server error" });
    }
});


app.post('/getpromocode', async (req, res) => {
    const { name } = req.body; 

console.log(name);
    try {
        const promo = await PromoCode.findOne({name});
      
        if (promo) {
            console.log("PromoCode Found:", promo); 
             const discount = promo.discount;
           return res.json({
                success: true,
                discount
            });
        } else {
           return res.status(404).json({ success: false, message: "PromoCode not Valid" });
        }
    } catch (error) {
        console.error("Error fetching PromoCode:", error);
       return res.status(500).json({ success: false, message: "Server error" });
    }
});







app.post('/checkout', fetchUser, async (req, res) => {
    const { discount = 0, totalPrice } = req.body; // Use default value for discount if not provided


    try {
        const userData = await User.findOne({ _id: req.user.id });
        let email = userData.email ;
        let username = userData.name ;
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not authenticated , You must Log in" });
        }

        let finalPrice = totalPrice - (discount / 100) * totalPrice;
        console.log("final price is ",finalPrice)
        
        userData.cartData = [];
        await userData.save();

        return res.json({
            success: true,
            finalPrice: finalPrice.toString(),
            email ,
            username
        });

        

       
    } catch (error) {
        console.error("Error checking out:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});
