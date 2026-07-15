console.log("\n\n   PRACTICAL EXAMPLES  !\n\n");

// Checking for falsy values in JavaScript
// define and set variable userCount to 0
// define the fasly value variable const1 to userCount or 10
const userCount = 0;


// define the variable const1 to be userCount or 10 using the logical OR "||" operator
const const1 = userCount || 10;

// Use the modern nullish coalescing operator "??" to define const2

//  what is  coalescing operator "??" ? 
//  The nullish coalescing operator "??" 
//  returns the right-hand side operand when the left-hand side operand is null or undefined,
//  otherwise it returns the left-hand side operand.

const const2 = userCount ?? 10;



console.log("The value of userCount is :", userCount);
console.log("The value of const1 is :", const1);

console.log("The valude of const2 is :", const2);

// Define paymentStatus variable and set it to 'succeeded'
const paymentStatus = 'succeeded';

// Define order variable and set it to an object with orderId and amount properties
const order = {
  orderId: 12345,
  amount: 100
};

// Define fulfillOrder function that takes an order object as a parameter and logs a message
function fulfillOrder(order) {
  console.log(`Order ${order.orderId} has been fulfilled with amount ${order.amount}.`);
}

// Check if paymentStatus is 'succeeded' and call fulfillOrder function if true

if (paymentStatus == 'succeeded') {
    fulfillOrder(order);
    console.log("Payment succeeded, order fulfilled.");
} else if (paymentStatus === 'failed') {
    console.log("Payment failed, order not fulfilled.");
} else {
    console.log("Payment status unknown, order not fulfilled.");
}

// if (Number.isNaN(score)) score = 0   