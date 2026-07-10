// TODO: Learnig async/await structure

// write a function that returns a promise that resolves after 2 seconds
// function name : delay

function delay() {
    // return a new promise that resolves after 2 seconds
  return new Promise((resolve) => {
    // use setTimeout to resolve the promise after 2 seconds
    setTimeout(() => {
        // resolve the promise with a message
      resolve('Resolved after 2 seconds');
      // log a message to the console
        console.log('Promise resolved');
    },
    // set the timeout to 2 seconds
    2000);
  });
}

function delayMore(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Resolved after 4 seconds');
            console.log('Promise resolved after 4 seconds');
        }, 4000);
    });
}



// write an async function that calls the delay function and logs the result
async function asyncFunction() {
  const result = await delay();
  console.log(result);
}

// call the async function
asyncFunction();    