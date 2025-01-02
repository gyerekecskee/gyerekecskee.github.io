function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
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

window.onload = loadSingleNews;

async function loadSingleNews() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const response = await fetch('/data/news.json');
        const data = await response.json();
        const news = data.news.find(item => item.id === id);
        
        if (news) {
            // Load main content
            document.getElementById('new-cover-title').textContent = news.title;
            document.getElementById('news-description').textContent = news.description;
            document.getElementById('news-image').src = news.imageSource;
            
            // Handle video content
            if (news.videoSource && news.videoSource !== 'nv') {
                document.getElementById('news-video').src = `videos/${news.videoSource}.mp4`;
            } else {
                document.getElementById('news-video')?.remove();
            }
            
            // Handle footnotes
            if (news.footnotes && news.footnotes.length > 0) {
                const footnotesContainer = document.createElement('div');
                footnotesContainer.className = 'footnotes mt-8';
                
                // Add horizontal line
                const horizontalLine = document.createElement('hr');
                horizontalLine.className = 'w-1/3 border-t border-gray-300 mb-4';
                footnotesContainer.appendChild(horizontalLine);
                
                const footnotesList = document.createElement('ol');
                footnotesList.className = 'list-decimal list-inside space-y-2 text-sm text-gray-600';
                
                news.footnotes.forEach((footnote, index) => {
                    const footnoteItem = document.createElement('li');
                    footnoteItem.id = `footnote-${index + 1}`;
                    footnoteItem.className = 'ml-4';
                    footnoteItem.textContent = footnote;
                    footnotesList.appendChild(footnoteItem);
                    
                    // Add footnote reference in the main text
                    const reference = `[${index + 1}]`;
                    const descriptionElement = document.getElementById('news-description');
                    if (descriptionElement.textContent.includes(`{{footnote-${index + 1}}}`)) {
                        descriptionElement.innerHTML = descriptionElement.innerHTML.replace(
                            `{{footnote-${index + 1}}}`,
                            `<sup><a href="#footnote-${index + 1}" class="text-blue-600 hover:text-blue-800">${reference}</a></sup>`
                        );
                    }
                });
                
                footnotesContainer.appendChild(footnotesList);
                document.getElementById('news-description').parentNode.appendChild(footnotesContainer);
            }
        } else {
            document.getElementById('new-cover-title').textContent = "News not found";
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}