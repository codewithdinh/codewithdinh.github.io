
addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", function(event){
        event.preventDefault(); // Prevent default form submission behavior
        if (event.submitter.id === 'cal') {
            // Calculate total logic
            calPricePerGallon();
        } else if (event.submitter.id === 'save') {
            // Save quote logic
            submitForm();
        }
    });
 });



//function to submit Form
async function submitForm() {
    // event.preventDefault(); // Prevent default form submission
    console.log("Submitting the form...");
    // Get form data
    const gallons = document.getElementById('gallons').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const deliveryDate = document.getElementById('delivery-date').value;
    const pricePerGallon = document.getElementById('price-per-gallon').value;
    const total = document.getElementById('total-amount-due').value;
    let bool = true;


    // Regular expression to match the address format
    const addressRegex = /^\d+ [a-zA-Z ]{1,50}, [a-zA-Z ]{1,50}, [a-zA-Z]{1,16}, \d{5}$/;
    bool = addressRegex.test(deliveryAddress);
    console.log(bool);
    if (bool == false)
    {
        alert("Please enter a valid Address!\nShould be in the following format:\n123 Oak Drive, Tomball, TX, 77355");
        event.preventDefault();
        return;
    }



    // Send form data to server
    const response = await fetch('http://localhost:3000/submitQuote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gallons, deliveryAddress, deliveryDate, pricePerGallon, total})
    });

    if (response.ok) {
        alert('Quote submitted successfully');
        // Optionally, redirect user to another page
        // window.location.href = 'success.html';
    } else {
        alert('Failed to submit quote. Please try again.');
    }
}

//function to cal price per gallon
async function calPricePerGallon()  {
    
    console.log("Calculating suggested price per gallon and total amount...");
    try {
        const response = await fetch(`http://localhost:3000/submitQuote`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    });
    let PRICE_ = await response.json();
    let total = 0.0;
    const pricePerGallon = PRICE_.price;
    const galreq = document.querySelector("#gallons").value;
    let isTexasChecked = document.getElementById("texasCheckbox").checked;
    let hasOrderedBefore = document.getElementById("orderedBeforeCheckbox").checked;
    let margin = 0.0;
    let suggestedprice = 0.0;

    if (hasOrderedBefore)
        if (isTexasChecked)
            margin = margin + .01;
        else
            margin = margin + .03;
    else 
        if (isTexasChecked)
            margin = margin + .02;
        else 
        margin = margin + .04;
    margin = margin + .1;
    console.log("margin", margin);
    console.log("price", PRICE_);
    console.log("PRICE_.price", PRICE_.price);

    if (galreq > 1000)
        margin = margin + .02;
    else
        margin = margin + .03;
    margin = margin + 1;
    
    PRICE_.price = 1.5*margin;


    
    total = PRICE_.price * galreq;
    suggestedprice = total / galreq;
    document.getElementById('price-per-gallon').value= `$${suggestedprice.toFixed(2)}`;
    document.getElementById('total-amount-due').value= `$${total.toFixed(2)}`;
    } catch(error){
        console.log(error);
    };
}