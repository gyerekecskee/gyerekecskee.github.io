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
            
            // Format description with paragraphs
            const descriptionElement = document.getElementById('news-description');
            const formattedDescription = news.description
                .split('\n')
                .filter(paragraph => paragraph.trim()) // Remove empty paragraphs
                .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
                .join('');
            
            descriptionElement.innerHTML = formattedDescription;
            
            // Handle image
            if (news.imageSource) {
                document.getElementById('news-image').src = news.imageSource;
            } else {
                document.getElementById('news-image')?.remove();
            }

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
                    // Create footnote item
                    const footnoteItem = document.createElement('li');
                    footnoteItem.id = `footnote-${index + 1}`;
                    footnoteItem.className = 'ml-4';
                    
                    // Handle URLs in footnotes
                    if (footnote.startsWith('http')) {
                        const link = document.createElement('a');
                        link.href = footnote;
                        link.textContent = footnote;
                        link.className = 'text-blue-600 hover:text-blue-800 break-words';
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        footnoteItem.appendChild(link);
                    } else {
                        footnoteItem.textContent = footnote;
                    }
                    
                    footnotesList.appendChild(footnoteItem);

                    // Add footnote reference in the main text
                    const reference = `[${index + 1}]`;
                    const footnoteMarker = `{{footnote-${index + 1}}}`;
                    
                    // Replace all instances of the footnote marker
                    const paragraphs = descriptionElement.getElementsByTagName('p');
                    Array.from(paragraphs).forEach(p => {
                        if (p.innerHTML.includes(footnoteMarker)) {
                            p.innerHTML = p.innerHTML.replace(
                                footnoteMarker,
                                `<sup><a href="#footnote-${index + 1}" class="text-blue-600 hover:text-blue-800">${reference}</a></sup>`
                            );
                        }
                    });
                });

                footnotesContainer.appendChild(footnotesList);
                descriptionElement.parentNode.appendChild(footnotesContainer);
            }
        } else {
            document.getElementById('new-cover-title').textContent = "News not found";
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}