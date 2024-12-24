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

