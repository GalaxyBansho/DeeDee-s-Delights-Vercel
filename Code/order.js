 
 let checkoutBox = document.getElementById('checkout-box'); 
 let listItem = document.getElementById('checkout-list-item') 
 let checkoutList = document.getElementById('checkout-list')  
 let cartTotal = document.getElementById('checkout-total') 
 let clearButton = document.getElementById('submit-button-holder')

 let basket = JSON.parse(localStorage.getItem("cake")) || []
console.log(menuData)
//  let  calculation = () => { 
//   cartIcon.innerHTML= basket.map((x) => x.item).reduce((x, y) => x + y, 0)
// }; 
// calculation(); 

let generateCheckoutItems = ()=>{
    if (basket.length !== 0 ) { 
        return (checkoutList.innerHTML = basket 
            .map((x)=>{ 
                  
                let  {id,itemNumber,quantity} = x; 
                 
                let search = menuData.find((y)=> y.id === id) || [];
            return ` 
            <div class = "list-item">   
                <img class = "cart-item" src = ${search.cartimage}>
                <div class = "details"> 
                    <div class= "title-price-x"> 
                        <h4 class = "title-price"> 
                        <p>${search.name} </p> 
                        <p class = "cart-item-price-${search.itemNumber}">${search.price} </p>
                        </h4>  
                        <i onclick = "removeItem(${id})" class="bi bi-x-lg"></i> 
                        
                            
                    </div>  
                     <div class = "cart-buttons">  
                            <i onclick = "addItem(${id})" class = "bi bi-plus-lg"></i> 
                            <div  id = ${id} class = "item-counter-1">${quantity}</div>
                            <i onclick = "delItem(${id})" class="bi bi-dash-lg"></i> 
                        
                            </div>    
                        <h3 class = "list-item-total">$${quantity * search.price}</h3>
        </div> 
         
            </div>   
            
            
            `
        }).join("")) 
        
    }  
    else{  
       return(checkoutList.innerHTML = ` 
        <h2 class = "empty-cart">Cart is Empty </h2>  
        <a href ="menu.html"> 
        <button class="menu-back">Back</button> 
        </a>
        `  );
       
      
    } 
    
};  
generateCheckoutItems(); 



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
   generateCheckoutItems(); 
  
   update(selectedItem.id); 
    localStorage.setItem("cake", JSON.stringify(basket)); 
}   
 
let delItem = (id) => { 
    let selectedItem = id
  let search = basket.find((x)=> x.id === selectedItem.id); 
 
   if (search === undefined) return; 
   else if (search.quantity === 0) returns;  
  else {search.quantity -= 1;} 

// else {search.quantity -= 1} 
 update(selectedItem.id); 
    basket = basket.filter((x) => x.quantity !== 0); 
  TotalAmount(); 
   generateCheckoutItems();  
    localStorage.setItem("cake", JSON.stringify(basket));  
   
   
   

}

let update = (id) => {  
  let search = basket.find((x) => x.id === id);
  console.log(search.quantity); 
  document.getElementById(id).innerHTML =`${search.quantity}`; 
 
  // calculation();
   TotalAmount();
 generateCheckoutItems();  

};   

let removeItem = (id) => { 
    let selectedItem = id;  
    basket = basket.filter((x) => x.id !== selectedItem.id);   
   generateCheckoutItems();  
  TotalAmount(); 
   
 localStorage.setItem("cake", JSON.stringify(basket));  
    
    
}   

generateCheckoutItems();  
window.TotalAmount = () => { 
    if (basket.length !== 0) { 
        let amount = basket.map((x) => { 
            let { quantity, id } = x; 
            let search = menuData.find((y) => y.id === id) || []; 
            return quantity * (search.price || 0);
        }).reduce((x, y) => x + y, 0); 
        
        // Update your UI text
        cartTotal.innerHTML = `<p class="total-text">Total : $ ${amount.toFixed(2)}</p>`; 
        
        // 2. CRITICAL: Save the raw math number directly to a global property
        window.currentCartPrice = amount;

        // Sync with local storage and rebuild UI elements
        generateCheckoutItems();  
        localStorage.setItem("cake", JSON.stringify(basket));  

        // 3. Return the calculated amount if the function is called directly
        return amount;

    } else {
        // If the basket is completely empty, clean up the UI and variables
        window.currentCartPrice = 0;
        cartTotal.innerHTML = `<p class="total-text">Total : $ 0.00</p>`;
        
        generateCheckoutItems();  
        localStorage.setItem("cake", JSON.stringify(basket));  
        
        return 0;
    }   
}; 

 

  
 let clearCart = ()=> { 
    basket = [];  
   
          clearButton.innerHTML = ` 
    <button class="clear" id="clear" onclick = "clearCart()">Clear Cart</button>`   
      cartTotal.innerHTML = `<p class="total-text">Total : $ 
        0</p></div>` 
     TotalAmount();   
      generateCheckoutItems();  
    localStorage.setItem("cake", JSON.stringify(basket));   
 }  
    
      clearButton.innerHTML = ` 
    <button class="clear" id="clear" onclick = "clearCart()">Clear Cart</button>`   
      cartTotal.innerHTML = `<p class="total-text">Total : $ 
        0</p></div>` 
  generateCheckoutItems();  
  TotalAmount();  
 localStorage.setItem("cake", JSON.stringify(basket));  
     

// !!!PAYPAL
if (window.paypal) {
    window.paypal.Buttons({
        style: {
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
        },
        message: {
            amount: 100,
        },
createOrder(data, actions) { 
    // 1. Run the function to ensure calculations are completely up to date
    if (typeof window.TotalAmount === "function") {
        window.TotalAmount();
    }

    // 2. Pull the updated value straight from our new global storage tracker
    const currentTotal = window.currentCartPrice || 0; 

    console.log("Verified total for PayPal contract generation:", currentTotal);

    // 3. Safety brake check
    if (currentTotal <= 0) {
        alert("Your cart appears to be empty.");
        return;
    }

    // 4. Clean string delivery layout
    const formattedTotal = parseFloat(currentTotal).toFixed(2);

    return actions.order.create({
        purchase_units: [{
            amount: {
                currency_code: "USD",
                value: formattedTotal 
            }
        }]
    });
},
                // Direct Client Capture Handling
          async onApprove(data, actions) {
    try {
        // 1. Capture the funds from the transaction
        const details = await actions.order.capture();
        
        console.log("Capture details payload:", details);

        // 2. Clear the cart data so they don't buy the items twice
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem("cake"); // Empties your cart storage
        }

        // 3. ROUTE THE USER: Send them to your confirmation page
        // If your success file is in the same folder as checkout, use "success.html"
        // If it's in a src folder, adjust the path: "src/success.html"
        window.location.href = "success.html"; 

    } catch (error) {
        console.error("Direct execution block runtime crash:", error);
        resultMessage("Payment went through, but we failed to redirect. Please contact support.");
    }

         
        

const templateParams = {
    customer_name: details.payer.name.given_name,
    customer_email: details.payer.email_address, // Automatically grabs their PayPal email
    order_id: details.id,
    total_amount: window.currentCartPrice.toFixed(2)
};

emailjs.send("YOUR_SERVICE_ID", "TEMPLATE_ID_ORDER", templateParams)
    .then(() => {
        console.log("Receipt sent successfully!");
        window.location.href = "success.html";
    });
        console.log("Capture details payload:", details);

        // 2. Clear the cart data so they don't buy the items twice
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem("cake"); // Empties your cart storage
        }

        // 3. ROUTE THE USER: Send them to your confirmation page
        // If your success file is in the same folder as checkout, use "success.html"
        // If it's in a src folder, adjust the path: "src/success.html"
        window.location.href = "success.html"; 


},
                onError(err) {
                    console.error("SDK Root Interface Crash:", err);
                    resultMessage("An interface initialization failure occurred.");
                }
            }).render('#paypal');
        }

        function resultMessage(message) {
            const container = document.querySelector("#result-message");
            if (container) container.innerHTML = message;
        } 
 
        const menuToggle = document.querySelector('.menu-button-wrapper'); 
const genMenuShift = document.querySelector('.page-menu'); 
const genCheckoutShift = document.querySelector('.checkout-media');   

menuToggle.addEventListener('click',()=>{ 
     menuToggle.classList.toggle('active') 
     genMenuShift.classList.toggle('active')
     genCheckoutShift.classList.toggle('active')
});    


