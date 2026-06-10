let checkoutBox = document.getElementById('checkout-box'); 
let listItem = document.getElementById('checkout-list-item');
let checkoutList = document.getElementById('checkout-list');  
let cartTotal = document.getElementById('checkout-total');
let clearButton = document.getElementById('submit-button-holder');

let basket = JSON.parse(localStorage.getItem("cake")) || [];
console.log(menuData);

let generateCheckoutItems = () => {
    if (basket.length !== 0) { 
        return (checkoutList.innerHTML = basket 
            .map((x) => { 
                let { id, itemNumber, quantity } = x; 
                let search = menuData.find((y) => y.id === id) || [];
                return ` 
                <div class="list-item">   
                    <img class="cart-item" src="${search.cartimage}">
                    <div class="details"> 
                        <div class="title-price-x"> 
                            <h4 class="title-price"> 
                                <p>${search.name}</p> 
                                <p class="cart-item-price-${search.itemNumber}">${search.price}</p>
                            </h4>  
                            <i onclick="removeItem(${id})" class="bi bi-x-lg"></i> 
                        </div>  
                        <div class="cart-buttons">  
                            <i onclick="addItem(${id})" class="bi bi-plus-lg"></i> 
                            <div id="${id}" class="item-counter-1">${quantity}</div>
                            <i onclick="delItem(${id})" class="bi bi-dash-lg"></i> 
                        </div>    
                        <h3 class="list-item-total">$${(quantity * search.price).toFixed(2)}</h3>
                    </div> 
                </div>`;
            }).join("")); 
    } else {  
        return (checkoutList.innerHTML = ` 
        <h2 class="empty-cart">Cart is Empty </h2>  
        <a href="menu.html"> 
            <button class="menu-back">Back</button> 
        </a>`);
    } 
};  
generateCheckoutItems(); 

let addItem = (id) => {  
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id); 

    if (search === undefined) { 
        basket.push({ 
            id: selectedItem.id, 
            quantity: 1
        }); 
    } else {
        search.quantity += 1;
    }
    generateCheckoutItems(); 
    update(selectedItem.id); 
    localStorage.setItem("cake", JSON.stringify(basket)); 
};   
 
let delItem = (id) => { 
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id); 
 
    if (search === undefined) return; 
    else if (search.quantity === 0) return;  
    else { search.quantity -= 1; } 

    update(selectedItem.id); 
    basket = basket.filter((x) => x.quantity !== 0); 
    TotalAmount(); 
    generateCheckoutItems();  
    localStorage.setItem("cake", JSON.stringify(basket));  
};

let update = (id) => {  
    let search = basket.find((x) => x.id === id);
    console.log(search.quantity); 
    document.getElementById(id).innerHTML = `${search.quantity}`; 
    TotalAmount();
    generateCheckoutItems();  
};   

let removeItem = (id) => { 
    let selectedItem = id;  
    basket = basket.filter((x) => x.id !== selectedItem.id);   
    generateCheckoutItems();  
    TotalAmount(); 
    localStorage.setItem("cake", JSON.stringify(basket));  
};   

generateCheckoutItems();  
window.TotalAmount = () => { 
    if (basket.length !== 0) { 
        let amount = basket.map((x) => { 
            let { quantity, id } = x; 
            let search = menuData.find((y) => y.id === id) || []; 
            return quantity * (search.price || 0);
        }).reduce((x, y) => x + y, 0); 
        
        cartTotal.innerHTML = `<p class="total-text">Total : $ ${amount.toFixed(2)}</p>`; 
        window.currentCartPrice = amount;

        generateCheckoutItems();  
        localStorage.setItem("cake", JSON.stringify(basket));  
        return amount;
    } else {
        window.currentCartPrice = 0;
        cartTotal.innerHTML = `<p class="total-text">Total : $ 0.00</p>`;
        generateCheckoutItems();  
        localStorage.setItem("cake", JSON.stringify(basket));  
        return 0;
    }   
}; 
TotalAmount();

let clearCart = () => { 
    basket = [];  
    clearButton.innerHTML = `<button class="clear" id="clear" onclick="clearCart()">Clear Cart</button>`;   
    cartTotal.innerHTML = `<p class="total-text">Total : $ 0.00</p>`;
    TotalAmount();   
    generateCheckoutItems();  
    localStorage.setItem("cake", JSON.stringify(basket));   
};  
    
if (clearButton) {
    clearButton.innerHTML = `<button class="clear" id="clear" onclick="clearCart()">Clear Cart</button>`;
}
generateCheckoutItems();  
TotalAmount();  
localStorage.setItem("cake", JSON.stringify(basket));  

// !!!PAYPAL ARCHITECTURE
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
            if (typeof window.TotalAmount === "function") {
                window.TotalAmount();
            }

            const currentTotal = window.currentCartPrice || 0; 
            console.log("Verified total for PayPal contract generation:", currentTotal);

            if (currentTotal <= 0) {
                alert("Your cart appears to be empty.");
                return;
            }

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
async onApprove(data, actions) {
    console.log("--- PayPal onApprove Triggered ---");
    try {
        const details = await actions.order.capture();
        console.log("PayPal Capture successful!", details);

        // Safe fallback calculations
        const subtotal = window.currentCartPrice || 0;
        const estimatedTax = subtotal * 0.0825; // 8.25% Sales tax
        const grandTotal = subtotal + estimatedTax;

        // Safe array fallback mapping
        const localBasket = (typeof basket !== 'undefined') ? basket : [];
        const translatedOrders = localBasket.map(item => {
            let search = (typeof menuData !== 'undefined' ? menuData : []).find(y => y.id === item.id) || {};
            return {
                name: search.name || "Delicious Baked Good",
                units: item.quantity || 1,
                price: ((search.price || 0) * (item.quantity || 1)).toFixed(2),
                image_url: `https://deedelights.vercel.app/${search.cartimage || ''}`
            };
        });

        // Extract dynamic customer billing address directly from real authorized session
        const liveCustomerEmail = details.payer?.email_address || "customer@email.com";
        const transactionId = details.id || "PAYID-GENERATED";
         
        console.log("RAW ITEMS ARRAY:", translatedOrders);
// Look for items inside translatedOrders, fallback to PayPal's native items list
const itemsToMap = Array.isArray(translatedOrders) ? translatedOrders : (details.purchase_units?.[0]?.items || []);

const ordersTextString = itemsToMap
    .map(item => {
        // PayPal uses item.quantity, frontend frameworks sometimes use item.qty or item.units
        // We also use parseInt to make sure it reads the number correctly
        const qty = parseInt(item.quantity || item.qty || item.units || 1, 10);
        return `${item.name || 'Item'} (Qty: ${qty})`;
    })
    .join('\n');
// 2. Build the final params using that string
const templateParams = {
    order_id: transactionId,
    orders: ordersTextString, // 👈 This MUST be the string variable, NOT translatedOrders          
    total_cost: subtotal.toFixed(2),         
    cost_tax: estimatedTax.toFixed(2),          
    cost_total: grandTotal.toFixed(2),       
    customer_email: details.payer.email_address
};

// Leave your console.log debuggers below this...

        console.log("Attempting dispatch to EmailJS with parameters:", templateParams); 

        console.log("--- EMAILJS CRITICAL DEBUG ---");
Object.keys(templateParams).forEach(key => {
    console.log(`${key}:`, {
        value: templateParams[key],
        type: typeof templateParams[key],
        isArray: Array.isArray(templateParams[key])
    });
});
console.log("-------------------------------");
        // Nested EmailJS Try/Catch
        try {
            const emailResponse = await emailjs.send('service_vsisk79', 'template_i6aac68', templateParams, 'CZtgGMeUMpaccH9kO');
            console.log('Transaction receipt sent successfully!', emailResponse.status, emailResponse.text);
        } catch (emailError) {
            console.error('Email pipeline execution failed:', emailError);
        }

    } catch (error) {
        // This closes the master parent try block
        console.error("CRITICAL CRASH inside PayPal master onApprove loop:", error);
    }

        },
        onError(err) {
            console.error("SDK Root Interface Crash:", err);
            resultMessage("An interface initialization failure occurred.");
        }
    }).render('#paypal');
}

// Result Message helper function
function resultMessage(message) {
    const container = document.querySelector("#result-message");
    if (container) container.innerHTML = message;
}
 
const menuToggle = document.querySelector('.menu-button-wrapper'); 
const genMenuShift = document.querySelector('.page-menu'); 
const genCheckoutShift = document.querySelector('.checkout-media');   

if (menuToggle) {
    menuToggle.addEventListener('click', () => { 
         menuToggle.classList.toggle('active'); 
         if (genMenuShift) genMenuShift.classList.toggle('active');
         if (genCheckoutShift) genCheckoutShift.classList.toggle('active');
    });    
}
