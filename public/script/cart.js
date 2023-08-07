let carts=document.querySelectorAll('.btn-cart');

let products=[
    {
        name:'Macbook pro',
        tag:'Macbook pro',
        price: 2250,
        inCart:0

    },
    {
        name:'Macbook air with m1 chip',
        tag:'Macbook air',
        price: 1875,
        inCart:0

    },
    {
        name:'Asus ROG strix g15',
        tag:'Asus ROG',
        price: 2500,
        inCart:0

    },
    {
        name:'HP OMEN',
        tag:'HP OMEN',
        price: 2000,
        inCart:0

    }
];

for(let i=0;i<carts.length;i++){
    carts[i].addEventListener('click',() => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}
function onLoadCartNumbers(){
   let productNumbers=localStorage.getItem('cartNumbers');

   if(productNumbers){
    document.querySelector('.cart span').textContent=productNumbers;
   }
}

//cart number

function cartNumbers(product){
    
    let productNumbers=localStorage.getItem('cartNumbers');
    

   productNumbers=parseInt(productNumbers);

   if(productNumbers){
    localStorage.setItem('cartNumbers',productNumbers + 1);
    document.querySelector('.cart span').textContent = productNumbers + 1;
}else{
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.cart span').textContent = 1;
}
  setItems(product);
 }
 function setItems(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
   

    if(cartItems !=null){
        if(cartItems[product.tag] == undefined){
            cartItems={
                ...cartItems,
                [product.tag]:product
            }
        }
         cartItems[product.tag].inCart +=1;
    }else{
        product.inCart = 1;
    cartItems={
        [product.tag]:product
    }

  
    }

    
    localStorage.setItem("productsInCart",JSON.stringify (cartItems));
}   
function totalCost(product){
   // console.log("The product price is ",product.price);
   let cartCost = localStorage.getItem('totalCost');
   
   console.log("My cartCost is",cartCost) ;
   console.log(typeof cartCost);

   if(cartCost != null){
    cartCost=parseInt(cartCost);
     localStorage.setItem("totalCost",cartCost + product.price);
   }else{
    localStorage.setItem("totalCost",product.price);
   }

   
}


function displayCart()
{
  let cartItems=localStorage.getItem("productsInCart");
  cartItems=JSON.parse(cartItems);
let productContainer=document.querySelector(".products");
let cartCost = localStorage.getItem('totalCost');

  if(cartItems && productContainer ){
   productContainer.innerHTML = '';
   Object.values(cartItems).map(item =>{
     productContainer.innerHTML += `
     <div class="product">
      <ion-icon name="close-circle-outline"></ion-icon>
      <img src="./images/${item.tag}.jpg">
      <span>${item.name}</span>
      </div>
      <div class="price">Rs.${item.price},00</div>
      <div class="quantity">
      <ion-icon name="chevron-back-circle-outline"></ion-icon>
      <span>${item.inCart}</span>
      <ion-icon name="chevron-forward-circle-outline"></ion-icon>
      </div>

      <div class="total">
      Rs.${item.inCart * item.price},00</div>
     `
   });

   productContainer.innerHTML +=`
   <div class="basketTotalContainer'>
   <h4 class="basketTotalTitle">
   Basket Total</h4>
   <h4 class="basketTotal">
   Rs.${cartCost},00</h4>
   `

   }
}


 onLoadCartNumbers();
 displayCart(); 
   

