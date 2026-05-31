console.log('Working Still');
const menuOpen = document.getElementById('menu-button-wrapper'); 
const menuShift = document.getElementById('page-mover');
const itemButtonOne = document.querySelector('.get-now-1');  

 
 let menu = document.getElementById('page-item-holder'); 

 
 let basket = JSON.parse(localStorage.getItem("cake")) || [];

 let generateMenu = () => { 
    return (menu.innerHTML = menuData.map((x)=>{  
      let {id, name, itemNumber, price, img, desc} = x; 
      let search = basket.find((x)=> x.id === id) || []
     return `  <div class="page-menu-item-${x.itemNumber}">  

            <h1 class="item-name-1">${name}</h1>  
           <span class="price-1">$${price}</span>
            <p class="item-description-1">${desc}  
            </p> 
        <div class="get-button-holder"> <button id = "get-now-${itemNumber}" class="get-now-${itemNumber}" onclick = "addItem(${id})">Add to Cart</button></div>
             <h6 id = "${id}" class="item-counter-1"> 
             You have: ${search.quantity === undefined ? 0: search.quantity} </h6>  
            <div class="page-menu-background-${img}"></div> 
        </div> `
    }).join(""));
 }; 
generateMenu(); 

let addItem = (id) => {  
  let selectedItem = id
  let search = basket.find((x)=> x.id === selectedItem.id); 

  if (search === undefined) { 
      basket.push({ 
    id: selectedItem.id, 
    quantity: 1
  }); 
  }

else {search.quantity += 1}
   
  
   update(selectedItem.id); 
    localStorage.setItem("cake", JSON.stringify(basket)); 
} 



function addToCart(){
    let itemAdded = document.getElementById('get-now-1'); 
    itemAdded.addEventListener('click',()=>{  
  itemAdded.classList.add('selected');  
  itemAdded.innerHTML=('Added !')
 });  


  itemAdded.addEventListener('mouseleave',()=>{   
    setTimeout(()=>{
    itemAdded.classList.remove('selected') 
    itemAdded.innerHTML=('Add to Cart')  
 }, 1500)})
}; 
function addToCart(){
    let getButton1 = document.getElementById('get-now-1'); 
    getButton1.addEventListener('click',()=>{  
  getButton1.classList.add('selected');  
  getButton1.innerHTML=('Added !')
 });  


  getButton1.addEventListener('mouseleave',()=>{   
    setTimeout(()=>{
    getButton1.classList.remove('selected') 
    getButton1.innerHTML=('Add to Cart')  
 }, 1500)})  

    let getButton2 = document.getElementById('get-now-2'); 
    getButton2.addEventListener('click',()=>{  
  getButton2.classList.add('selected');  
  getButton2.innerHTML=('Added !')
 });  


  getButton2.addEventListener('mouseleave',()=>{   
    setTimeout(()=>{
    getButton2.classList.remove('selected') 
    getButton2.innerHTML=('Add to Cart')  
 }, 1500)})
}; 
    let getButton3 = document.getElementById('get-now-3'); 
    getButton3.addEventListener('click',()=>{  
  getButton3.classList.add('selected');  
  getButton3.innerHTML=('Added !')
 });  


  getButton3.addEventListener('mouseleave',()=>{   
    setTimeout(()=>{
    getButton3.classList.remove('selected') 
    getButton3.innerHTML=('Add to Cart')  
 }, 1500)})  

    let getButton4 = document.getElementById('get-now-4'); 
    getButton4.addEventListener('click',()=>{  
  getButton4.classList.add('selected');  
  getButton4.innerHTML=('Added !')
 });  


  getButton4.addEventListener('mouseleave',()=>{   
    setTimeout(()=>{
    getButton4.classList.remove('selected') 
    getButton4.innerHTML=('Add to Cart')  
 }, 1500)}) 
;
addToCart();
 
let update = (id) => {  
  let search = basket.find((x) => x.id === id);
  console.log(search.quantity); 
  document.getElementById(id).innerHTML =`You have: ${search.quantity}`; 

  // calculation();
  
}; 

menuOpen.addEventListener('click',()=>{ 
   menuOpen.classList.toggle('active'); 
   menuShift.classList.toggle('active');
});
 
// let  calculation = () => { 
//   cartIcon.innerHTML= basket.map((x) => x.item).reduce((x, y) => x + y, 0)
// };
// Created a new function to call in onclick for the html and use the id to variate the outcome to still get the same effect as before
//! to Remove from cart:: basket = basket.filter ((x) => x.quantity !== 0) 