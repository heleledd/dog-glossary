const buttonRandom = document.getElementById("button-random-dog");
const content = document.querySelector("#content");
const buttonShowBreed = document.getElementById("button-show-breed");

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

async function fetchDogByBreed(breed) {
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
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

async function checkIsBreed(breed) {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let allDogBreeds = data.message;
        console.log(allDogBreeds);
    } catch (error) {
        console.error("Can't reach the dog api. Detailed error:", error);
    }

}

buttonRandom.addEventListener('click', () => {
    // Do something when the button is clicked
    let dogImage = fetchDog();
    content.innerHTML = `<img src="${dogImage}" alt="random dog">`;
});

buttonShowBreed.addEventListener('click', () => {
    const inputBreed = document.getElementById("input-breed");
    const breed = inputBreed.value.toLowerCase().trim();
    if (!breed) return;     // If the breed is undefined, return without anything
    let isBreed = checkIsBreed(breed);
    if (isBreed) {
        let dogImage = fetchDogByBreed();
        content.innerHTML = `<img src="${dogImage}" alt="random dog">`;
    } else {
        content.innerHTML = `<p>Breed not found!</p>`;
    }

})
