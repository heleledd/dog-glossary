// Constants for API endpoints and DOM elements
const API_ENDPOINTS = {
    RANDOM_DOG: 'https://dog.ceo/api/breeds/image/random',
    ALL_BREEDS: 'https://dog.ceo/api/breeds/list/all',
    BREED_IMAGES: (breed) => `https://dog.ceo/api/breed/${breed}/images`
};

const DOM_ELEMENTS = {
    content: document.querySelector("#content"),
    breedInput: document.getElementById('input-breed'),
    randomDogButton: document.getElementById("button-random-dog"),
    showBreedButton: document.getElementById('button-show-breed'),
    showSubBreedButton: document.getElementById('button-show-sub-breed'),
    showAllBreedsButton: document.getElementById('button-show-all')
};

// Reusable fetch function with error handling
async function fetchFromAPI(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// Display functions
function displayImage(imageUrl, altText) {
    DOM_ELEMENTS.content.innerHTML = `<img src="${imageUrl}" alt="${altText}" class="w-full h-full object-contain">`;
}

function displayError(message) {
    DOM_ELEMENTS.content.innerHTML = `<p class="error">${message}</p>`;
}

function displayLoading() {
    DOM_ELEMENTS.content.innerHTML = '<p>Fetching dog image...</p>';
}

function createListFromArray(list, container) {
    // Clear previous content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create a single document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    const ol = document.createElement('ol');

    list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ol.appendChild(li);
    });

    fragment.appendChild(ol);
    container.appendChild(fragment);
}

function createListFromObject(obj, container) {
    // Clear previous content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create a single document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    const ol = document.createElement('ol');

    for (let key in obj) {
        const li = document.createElement('li');

        if (Array.isArray(obj[key])) {
            // If it's an array, create a nested list
            li.textContent = key;  // Use the key as the main bullet point
            if (obj[key].length > 0) {
                const subUl = document.createElement('ul');
                obj[key].forEach(item => {
                    const subLi = document.createElement('li');
                    subLi.textContent = item;
                    subUl.appendChild(subLi);
                });
                li.appendChild(subUl);
            }
        } else {
            // If it's not an array, just display the value
            li.textContent = `${obj[key]}`;
        }

        ol.appendChild(li);
    }

    fragment.appendChild(ol);
    container.appendChild(fragment);
}



async function fetchDog() {
    try {
        displayLoading();
        const data = await fetchFromAPI(API_ENDPOINTS.RANDOM_DOG);
        displayImage(data.message, 'random dog');
    } catch (error) {
        console.error('Fetch error:', error);
        displayError(`Something went wrong while fetching a random dog! ${error.message}`);
    }
}

async function fetchDogByBreed(breed) {
    try {
        displayLoading();
        const data = await fetchFromAPI(API_ENDPOINTS.BREED_IMAGES(breed));
        const dogImageArray = data.message;
        const randomImage = dogImageArray[Math.floor(Math.random() * dogImageArray.length)];
        displayImage(randomImage, `${breed} dog`);
    } catch (error) {
        console.error('Fetch error:', error);
        displayError(`Something went wrong while fetching an image of a ${breed}! ${error.message}`);
    }
}

async function fetchAllBreeds() {
    try {
        const data = await fetchFromAPI(API_ENDPOINTS.ALL_BREEDS);
        return data.message;
    } catch (error) {
        console.error("Can't reach the dog API:", error);
        throw error;
    }
}

async function checkIsBreed(breed) {
    try {
        const allDogBreeds = await fetchAllBreeds();
        return Object.prototype.hasOwnProperty.call(allDogBreeds, breed);
    } catch (error) {
        console.error("Error checking breed:", error);
        return false;
    }
}

async function fetchSubBreeds(breed) {
    try {
        const allDogBreeds = await fetchAllBreeds();
        if (allDogBreeds[breed].length > 0) {
            return allDogBreeds[breed];
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("Error checking breed:", error);
        return false;
    }
}

async function handleBreedSubmit() {
    const breed = DOM_ELEMENTS.breedInput.value.trim().toLowerCase();

    if (!breed) {
        displayError('Please enter a breed name!');
        return;
    }

    const isBreed = await checkIsBreed(breed);
    if (!isBreed) {
        displayError('Breed not found!');
        return;
    }

    await fetchDogByBreed(breed);
}

async function handleSubBreedSubmit() {
    const breed = DOM_ELEMENTS.breedInput.value.trim().toLowerCase();

    if (!breed) {
        displayError('Please enter a sub-breed name!');
        return;
    }

    const isBreed = await checkIsBreed(breed);
    if (!isBreed) {
        displayError('Breed not found!');
        return;
    }

    const subBreeds = await fetchSubBreeds(breed);
    if (!subBreeds) {
        displayError('No sub-breeds found!');
        return;
    } else {
        createListFromArray(subBreeds, DOM_ELEMENTS.content);

    }

}

async function handleAllBreedsSubmit() {
    const allBreeds = await fetchAllBreeds();
    createListFromObject(allBreeds, DOM_ELEMENTS.content);
}

// Event Listeners
DOM_ELEMENTS.randomDogButton.addEventListener('click', fetchDog);
DOM_ELEMENTS.showBreedButton.addEventListener('click', handleBreedSubmit);
DOM_ELEMENTS.showSubBreedButton.addEventListener('click', handleSubBreedSubmit);
DOM_ELEMENTS.showAllBreedsButton.addEventListener('click', handleAllBreedsSubmit);
