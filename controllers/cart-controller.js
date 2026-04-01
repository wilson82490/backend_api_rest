/* import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addProductToCart = async (req, res) => {
    try {

    


        console.log(req.body, req.user);

        const { productId } = req.body;

//NO validamos el usuario
 



        //validamos que el producto exista

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        

//Si viene la cantidad , tiene ser mayor o igual a 1 y sea un numero


if(req.body.quantity == undefined){
            req.body.quantity = 1;
        }

if(req.body.quantity < 1 || !Number.isInteger(req.body.quantity)){
    return res.status(400).json({ error: "Quantity must be greater than or equal to 1" });
}

//Validamos que tengamos stock suficiente

 const cartExists = await Cart.findOne({ user: req.user._id });
return res.json(cartExists);

if(req.body.quantity > product.stock){
    return res.status(400).json({ error: "Insufficient stock" });
}

const cart = new Cart({
    user: req.user._id,
    products: [],
});

const item = {
    products: product._id,
    quantity: req.body.quantity,
}
cart.products.push(item);
await cart.save();

       res.status(200).json({ message: "add product to cart", cart });
    
    }
    
    catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid product id" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}; */

import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

/* export const addToCart = async (req, res) => {
  try {
    // NO validamos el usuario

    // Validamos que el producto exista
    if (!req.body.product) {
      return res.status(422).json({ error: "El product id es obligatorio"});
    }

    const product = await Product.findById(req.body.product);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Si viene la cantidad, tiene que ser mayor o igual 1
    if (req.body.quantity == undefined) {
      req.body.quantity = 1;
    }

    if (!Number.isInteger(req.body.quantity) || req.body.quantity < 1) {
      return res
        .status(400)
        .json({ error: "Quantity must be greater than or equal to 0" });
    }

    // Validamos que tengamos stock suficiente
    if (req.body.quantity > product.stock) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const cartExisting = await Cart.findOne({
      user: req.user.id,
    });

    // No existe carrito
    if (!cartExisting) {
      const cart = new Cart({
        user: req.user.id,
        products: [],
      });

      const item = {
        product: req.body.product,
        quantity: req.body.quantity,
      };

      cart.products.push(item);
      await cart.save();

      res.status(201).json({
        message: "productos en el carrito",
        cart,
      });
    } else {
      // Si existe el Cart
      const item = {
        product: req.body.product,
        quantity: req.body.quantity,
      };

      cartExisting.products.push(item);
      cartExisting.save();

      res.status(201).json({
        message: "productos en el carrito",
        cartExisting,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Internal Server Error" });
  }


}; */
  

 export const addToCart = async (req, res) => {

   try {
    const {product: productId, quantity = 1} = req.body;
    const {id: userId} = req.user;

   if(!productId){
    return res.status(422).json({error: "Product id is required"});
   }

   if(quantity < 1 || !Number.isInteger(quantity)){
    return res.status(400).json({error: "Quantity must be greater than or equal to 1"});
   }

   const product = await Product.findById(productId);

   if(!product){
    return res.status(404).json({error: "Product not found"});
   }

   let cart = await Cart.findOne({user: userId});


   if(!cart){
    cart = new Cart({
        user: userId,
        products: [],
    });
   }

  const productExists = cart.products.find(p => p.product == productId);

  if (productExists ){
    if(productExists.quantity + quantity > product.stock){
      return res.status(400).json({error: "Insufficient stock"});
    }

    productExists.quantity += quantity;
  }
  else{
    if(quantity > product.stock){
      return res.status(400).json({error: "Insufficient stock"});
    }
    const newProduct = {
        product: productId,
        quantity
    }
    cart.products.push(newProduct);
  }
  
  


  if(productExists){
    
    productExists.quantity += quantity;
  } else {
     const newProduct= {
      product: productId, 
      quantity};
    cart.products.push(newProduct);
  }
  await cart.save()
  res.status(201).json({message: "Cart created", cart});
  
   } catch (error) {
    if(error.name === "CastError"){
        return res.status(400).json({error: "Invalid product id"});
    }
    res.status(500).json({ error: "Internal Server Error" });
   }
 }
//Agregar producto al carrito


export const getCart = async (req, res) => {

    try {
        const cart = await Cart.findOne({ 
            user: req.user.id
        }).populate("products.product", "name price");

        if(!cart){
            const newCart = new Cart({
            user: req.user.id,
            products: [],
          });
            return res.json(newCart);
        }

        return res.json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            user: req.user.id
        });

       if(!cart){
            const newCart = new Cart({
            user: req.user.id,
            products: [],
          });
            return res.json(newCart);
        }
        
        
        cart.products = [];
        await cart.save();

        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const removeFromCart = async (req, res) => {
  try {
     const {productId} = req.params;
   const {id: userId} = req.user;
   
   const cart = await Cart.findOne({ 
            user: userId
        })

    if(!cart){
        return res.status(404).json({error: "Cart not found"});
    }

    const filtered = cart.products.filter(p => p.product != productId);

    

    if(filtered.length == cart.products.length){
        return res.status(404).json({error: "Product not found in cart"});
    }

    cart.products = filtered;
    await cart.save();

    res.json({message: "Product removed from cart", cart});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }

  };
