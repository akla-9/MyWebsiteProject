// https://api.themoviedb.org/3/genre/movie/list

//My API TMDB the movie database api

const APIkey = 'api_key=00e81cba95a2c865fc8f5cbf15a6a758';
const baseaddress = 'https://api.themoviedb.org/3';
const apiurl =  baseaddress + '/discover/movie?sort_by=popularity.desc&'+APIkey;
const imageURL = 'https://image.tmdb.org/t/p/w500';
const searchURL = baseaddress +'/search/movie?'+APIkey;

const main = document.getElementById('main');
const searchButton = document.querySelector('.search-button');
const searchBox = document.querySelector('.search-box');


// // Dropdown menu 
/* When user hovers over the menu titke,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("dropdown-options").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.more-options')) {
    var dropdowns = document.getElementsByClassName("dropdown-options");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



//my variables
const myBasket = document.querySelector('.myBasket');
const closeCartButton = document.querySelector('.close-cart');
const clearCartButton = document.querySelector('.clear-cart');
console.log(clearCartButton)
const mainCart = document.querySelector('.cart');
const cartFolder = document.querySelector('.cart-folder');

// selecting cart items 

const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemQty = document.querySelector('.item-qty');
const cartContent = document.querySelector('.cart-content');
const myMoviesDisplay = document.querySelector('.movies-display');

//shopping cart
let cart =[];


//buttons
let shopAddButtons = [];



//defining classes

//getting the movies
// getProducts(apiurl)

class Products {
  async getProducts(){
    try{
        let result = await fetch(apiurl)
        let data = await result.json();
        let movies = data.results;
        console.log(movies)
        movies = movies.map(item =>{
          const {title,poster_path,id,vote_average, release_date,overview}= item;
        //   const {title, price} = item.fields;
        //   const {id} = item.sys;
        //   const image = item.fields.image.fields.file.url;
          return {title,id,poster_path}
    
        })
        // console.log(movies);
        return movies;
        
      } 
      
      catch(error) {
        console.log(error)
      }
 }
}

// displaying the products
class Mydisplay {

        displayMovies(products){
        console.log()
        let result ="";
        products.forEach(dvd =>{
            result +=`
            <article class="movie">
                <div class="image-container">
                  <img class="dvd-image" src= ${imageURL+dvd.poster_path}>
                  <button type ="submit" class="cart-button" data-id= ${dvd.id}>
                    <i class="fas fa-shopping-cart"></i>
                    Add to cart
                  </button>
                </div>
                <h3>${dvd.title}</h3>
                <h3 class="dvd-id">${dvd.id}</h3>
                <h4>£${dvd.price}</h4>
              </article>
    
            `
            // console.log(dvd)
        })
        myMoviesDisplay.innerHTML = result;
      }



  getCartButton(){
    const addToCartButtons = [...document.querySelectorAll('.cart-button')];
    shopAddButtons = addToCartButtons;
    addToCartButtons.forEach(button =>{
      let id = button.dataset.id;
      let iteminCart = cart.find(item => item.id===id);
      // console.log(button);
      
      if(iteminCart){
        button.innerText = "added";
      }
      
      button.addEventListener('click', (e)=>{
        // console.log(e);
        e.target.innerText = "added";

        // get movies from local products
        let cartItem ={...Storage.getMovies(id),ItemAmount:1};
        console.log(cartItem);


        //add movies to cart
        cart = [...cart, cartItem];
        console.log(cart);


        //save cart in local storage
        Storage.saveCart(cart);


        //set cart values
        this.setCartElements(cart)


        //display cart item
        this.addItemToCart(cartItem);
        
        //show cart
        this.showCart();
          
        })

        
      })
      
     
    };
   


  setCartElements(){
    let myCurrentTotal = 0;
    let itemsTotal = 0;
    cart.map(item=>{
      myCurrentTotal +=item.price * item.ItemAmount;
      itemsTotal += item.ItemAmount;
    })

    cartTotal.innerText = parseFloat(myCurrentTotal.toFixed(2));
    itemQty.innerText = itemsTotal;
    console.log(cartTotal, itemsTotal);
  }

  addItemToCart(item){
    const div = document.createElement('div');
          div.classList.add('cart-items');
          div.innerHTML =`<img src=${imageURL+item.poster_path} alt="movie-front-image">      
            <div>
             <h4>${item.title}</h4>
             <h5>£${item.price}</h5>
             <span class="remove-item" data-id=${item.id} >remove</span>
            </div> 
            <div>
             <i class="fas fa-chevron-up" data-id=${item.id} ></i>
             <p class="item-qty">${item.ItemAmount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id} ></i>
            </div> `

            cartContent.appendChild(div);
            // console.log(cartContent)
  }
showCart(){
  cartFolder.classList.add('transparentBcg');
  mainCart.classList.add('showCart');
}

setSiteUp(){
  cart = Storage.getCart();
  //the values below will change the values of the cart items
  this.setCartElements(cart);
  this.populateCart(cart);
  myBasket.addEventListener('click', this.showCart);
  closeCartButton.addEventListener('click',this.hideCart)
 }

populateCart(cart){
  cart.forEach(item =>this.addItemToCart(item))
  
}

hideCart(){
  cartFolder.classList.remove('transparentBcg');
  mainCart.classList.remove('showCart');
}

cartActions(){
  // clear cart button
  clearCartButton.addEventListener('click',()=>{this.clearCart();
   })
   cartContent.addEventListener('click',(e)=>{
    // console.log(e.target)
    if(e.target.classList.contains('remove-item')){
      let removeItem =e.target;
      let id = removeItem.dataset.id;
      cartContent.removeChild(removeItem.parentElement.parentElement)

      this.removeItem(id);
    }
    else if (e.target.classList.contains("fa-chevron-up")){
      let increaseQty = e.target;
      let id = increaseQty.dataset.id;
     
      //return the item whose id matches the item clicked
      let itemInTheCart = cart.find(item => item.id === id)
      itemInTheCart.ItemAmount = itemInTheCart.ItemAmount +1;
      Storage.saveCart(cart);
      this.setCartElements(cart);
      increaseQty.nextElementSibling.innerText = itemInTheCart.ItemAmount;

    }
    else if (e.target.classList.contains("fa-chevron-down")){
      let decreaseQty = e.target;
      let id = decreaseQty.dataset.id;

      let itemInTheCart = cart.find(item => item.id === id)
      itemInTheCart.ItemAmount = itemInTheCart.ItemAmount -1;
      if(itemInTheCart.ItemAmount > 0){
        Storage.saveCart(cart);
        this.setCartElements(cart);
        decreaseQty.previousElementSibling.innerText = itemInTheCart.ItemAmount;

      }
      else{
        cartContent.removeChild(decreaseQty.parentElement.parentElement)
        this.removeItem(id);
      }
         
    }

   })
}
//create an array of all the ids in the cart and loop over them
clearCart(){
  
  let myCartItems = cart.map(item=>item.id);
   myCartItems.forEach(id => this.removeItem(id));

  while(cartContent.children.length>0){
    cartContent.removeChild(cartContent.children[0])
  }




}
//returns every item in the cart that does not the specified id.this updates the cart.
removeItem(id){
  cart = cart.filter(item =>item.id !==id);
  this.setCartElements(cart);
  Storage.saveCart(cart);
  let button =this.getOnlyOneButton(id);
  button.innerHTML=`<i class="fas fa-shopping-cart"></i>Add to cart`;
}

//looks through the array of buttons and gets the specific id of the button 
//that was used to add the item to cart and returns it
getOnlyOneButton(id){
 return  shopAddButtons.find(button =>button.dataset.id===id);
}

}

//local storage
class Storage {
  static saveDvdProduct(movies) {
    localStorage.setItem("movies",JSON.stringify(movies));
  }  
  static getMovies(id){
    let mymovies = JSON.parse(localStorage.getItem('movies'));
    return mymovies.find(product=>product.id === id)
  }

  //gets the new cart values and saves it in the local storage
  static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
  }

  //returns any item that is in the cart.
  static getCart(){
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }

}

document.addEventListener('DOMContentLoaded',()=>{

    const mydisplay = new Mydisplay();
    const products = new Products();
    // console.log(products);
    //set site up
    mydisplay.setSiteUp();

    //get all products
    // products.getProducts().then(movies => console.log(movies));
    products.getProducts().then(movies => {
        mydisplay.displayMovies(movies);
        Storage.saveDvdProduct(movies);
       }).then(()=> {
            mydisplay.getCartButton();
            mydisplay.cartActions();

    });

  // searchButton.addEventListener('submit',(e)=>{
  //   e.preventDefault();

  //   const searchBoxValue =searchBox.value;
  //   if(searchBoxValue){
  //     products.getProducts(searchURL+'&query='+searchTerm)
  //   }
  //   else{
  //     products.getProducts(apiurl);
  //   }
  // })
    

})

