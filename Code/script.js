console.log('Still Working'); 

const pageShift = document.querySelector('.hero-section'); 
const menuToggle = document.querySelector('.menu-button-wrapper'); 
const fullShift = document.querySelector('.gradient-transition'); 
const cube = document.querySelector('.box') 
const rightButton = document.querySelector('.right');
const leftButton = document.querySelector('.left'); 
let navMenu = document.getElementById('navigation'); 
const successShift = document.querySelector('.success-body')


menuToggle.addEventListener('click',()=>{ 
     menuToggle.classList.toggle('active') 
     pageShift.classList.toggle('active') 
     fullShift.classList.toggle('active')
     genMenuShift.classList.toggle('active')
     genPageShift.classList.toggle('active')
});     

const genMenuShift = document.querySelector('.page-menu'); 
const genPageShift = document.querySelector('.body-content'); 

menuToggle.addEventListener('click',()=>{ 
     
     genMenuShift.classList.toggle('active') 
     genPageShift.classList.toggle('active')
})  

menuToggle.addEventListener('click',()=>{ 
     successShift.classList.toggle('active');
   
})




// leftButton.addEventListener('click', ()=>{ 
//      cube.classList.toggle('active1');
// }) 

