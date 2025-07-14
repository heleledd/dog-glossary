const buttonRandom = document.getElementById("button-random-dog");
const content = document.querySelector("#content");

buttonRandom.addEventListener('click', () => {
    // Do something when the button is clicked
    let dogImage = fetchDog();
    content.innerHTML = `<img src="${dogImage}" alt="random dog">`;
});

async function fetchDog() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let dogImage = data.message;
        content.innerHTML = `<img src="${dogImage}" alt="random dog">`;
    } catch (error) {
        console.error('Detailed error:', error);
        // Handle the error appropriately, maybe show a message to the user
        content.innerHTML = `<p>Oops! Something went wrong! Error: ${error.message}</p>`;
    }
}


