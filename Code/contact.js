console.log('Ready for contact'); 

const name = document.getElementById('name-box'); 
const email = document.getElementById('email-box'); 
const inquiry = document.getElementById('inquiry-box') 
 

// import emailjs from '@emailjs/browser';

const sendContactEmail = async (e) => {
    e.preventDefault(); // Prevents the page from reloading on form submit

    const form = e.target;
    
    // 1. Extract values cleanly from the form inputs
    const templateParams = {
        name: form.user_name.value,
        email: form.user_email.value,
        subject: form.user_name.value || "New Contact Form Message",
        message: form.message.value
    };

    try {
        console.log("Sending contact message...", templateParams);
        
        // 2. Send to EmailJS
        const response = await emailjs.send(
            'service_vsisk79',   // Replace with your Service ID
            'template_m7197ys',  // Replace with your Contact Template ID
            templateParams,
            'CZtgGMeUMpaccH9kO'    // Replace with your Public Key
        );

        if (response.status === 200) {
            console.log("Message sent successfully!");
            alert("Thank you! Your message has been sent.");
            form.reset(); // Clears the form inputs for the user
        } 
        
    } catch (error) {
        console.error("EmailJS Contact Error:", error);
        alert("Oops! Something went wrong. Please try again.");
    }
};
