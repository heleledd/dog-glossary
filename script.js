const content = document.querySelector("#content");


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
        content.innerHTML = `<p>Oops! Something went wrong while fetching a random dog! Error: ${error.message}</p>`;
    }
}

async function fetchDogByBreed(breed) {
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let dogImageArray = data.message;
        let index = Math.floor(Math.random() * dogImageArray.length);   // choose randomly out of the images returned
        let dogImage = dogImageArray[index];
        content.innerHTML = `<img src="${dogImage}" alt="random dog">`;
    } catch (error) {
        console.error('Detailed error:', error);
        // Handle the error appropriately, maybe show a message to the user
        content.innerHTML = `<p>Oops! Something went wrong while fetching an image of a ${breed}! Error: ${error.message}</p>`;
    }
}

async function fetchAllBreeds() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Can't reach the dog api. Detailed error:", error);
        throw error; // Re-throw to handle it in the calling function
    }
}

async function checkIsBreed(breed) {
    try {
        const allDogBreeds = await fetchAllBreeds();
        let isBreed = allDogBreeds.hasOwnProperty(breed)
        return isBreed;
    } catch (error) {
        console.error("Error checking breed:", error);
        return false;
    }
}

async function handleBreedSubmit() {
    const breed = document.getElementById('input-breed').value.toLowerCase();
    const content = document.getElementById('content');

    const isBreed = await checkIsBreed(breed);

    if (!isBreed) {
        content.innerHTML = `<p>Breed not found!</p>`;
        return; // Exit the function early
    }

    // If we get here, the breed is valid, so proceed with fetching the dog image
    await fetchDogByBreed(breed);
}

document.getElementById("button-random-dog").addEventListener('click', fetchDog);
document.getElementById('button-show-breed').addEventListener('click', handleBreedSubmit);
