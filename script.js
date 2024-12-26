document.addEventListener("DOMContentLoaded", function() {

    // Load the header first
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for header');
            }
            console.log('Header loaded successfully');
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            console.log('Starting to load footer...');
            // Load the footer after the header has been loaded
            return fetch("footer.html");
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for footer');
            }
            console.log('Footer loaded successfully');
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading header or footer:', error));
});

document.querySelectorAll('.new').forEach(function(newsItem) {
    const titleElement = newsItem.querySelector('.new-title');
    const descriptionElement = newsItem.querySelector('.new-description');
    const title = titleElement.textContent.trim();
    const description = descriptionElement.textContent.trim();
    const linkElement = newsItem;
    const imgElement = newsItem.querySelector('img');
    const imgSource = imgElement.src;
    const vidSource = imgElement.alt;

    // Generate href dynamically
    const href = `news.html?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&src=${encodeURIComponent(imgSource)}&vSrc=${encodeURIComponent(vidSource)}`;
    linkElement.setAttribute('href', href);
});

/*
Scrolling for services.
*/
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');
const serviceBoxes = document.getElementById('service-boxes');

scrollLeftButton.addEventListener('click', () => {
    serviceBoxes.scrollBy({
        left: -500, // Adjust the value to scroll the desired amount
        behavior: 'smooth'
    });
});

scrollRightButton.addEventListener('click', () => {
    serviceBoxes.scrollBy({
        left: 500, // Adjust the value to scroll the desired amount
        behavior: 'smooth'
    });
});


/*
Hanuka kvíz
*/
const correctAnswer = 8;
const input = document.getElementById('a1');
const feedback = document.getElementById('f1');
let typingTimer;

// Add input event listener with debouncing
//input.addEventListener('input', function() {
//    clearTimeout(typingTimer);
//    typingTimer = setTimeout(check1Answer, 300); // Wait 300ms after user stops typing
//});

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        check1Answer();
    }
});

function check1Answer() {
    const userAnswer = parseInt(input.value);
    console.log(userAnswer);
    console.log(input.value);
    if (input.value.length > 0) {
        feedback.style.opacity = '1';
        
        if (isNaN(userAnswer)) {
            console.log("nan");
            feedback.textContent = "Please enter a valid number";
            feedback.className = 'feedback incorrect';
        } else if (userAnswer === correctAnswer) {
            feedback.textContent = "Jó válasz. Bét Sámmáj szerint első nap kell nyolc gyertyát gyújtani és minded nap eggyel kevesebbet. Mi Bét Hillél szerint csináljuk.Az ehhez a kérdéshez tartozó betű a CS.";
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = "Rossz válasz";
            feedback.className = 'feedback incorrect';
        }
    } else {
        feedback.style.opacity = '0';
    }
}
