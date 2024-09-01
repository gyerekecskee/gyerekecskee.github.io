function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function loadNews() {
    const title = getQueryParameter('title');
    const description = getQueryParameter('description');
    const src = getQueryParameter('src');
    if (title && description && src) {
        document.getElementById('new-cover-title').textContent = decodeURIComponent(title);
        document.getElementById('news-description').textContent = decodeURIComponent(description);
        document.getElementById('news-image').src = decodeURIComponent(src);
    } else {
        document.getElementById('new-cover-title').textContent = "News not found";
        document.getElementById('news-description').textContent = "We couldn't find the news item you're looking for.";
    }
}

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

window.onload = loadNews;