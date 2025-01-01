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
        feedback.style.display = 'flex';
        
        if (isNaN(userAnswer)) {
            console.log("nan");
            feedback.textContent = "Please enter a valid number";
            feedback.className = 'feedback incorrect';
        } else if (userAnswer === correctAnswer) {
            feedback.textContent = "Jó válasz. Bét Sámmáj szerint első nap kell nyolc gyertyát gyújtani és minded nap eggyel kevesebbet. Mi Bét Hillél szerint csináljuk. Az ehhez a kérdéshez tartozó betű a CS.";
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = "Rossz válasz";
            feedback.className = 'feedback incorrect';
        }
    }
}
/*
h2
*/
const correctOrder = ['5', '8', '7', '2', '9', '1', '4', '3', '6']; // represents 1,2,3,4,5
let draggedItem = null;

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('list');
    initializeItems();
});

function initializeItems() {
    const items = document.querySelectorAll('.item');
            items.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('drop', handleDrop);

                // Touch events
                item.addEventListener('touchstart', handleTouchStart, { passive: false });
                item.addEventListener('touchmove', handleTouchMove, { passive: false });
                item.addEventListener('touchend', handleTouchEnd);
            });
        }

        function handleTouchStart(e) {
            if (!e.target.closest('.drag-handle')) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            touchStartY = touch.clientY;
            currentTouchedItem = this;
            this.classList.add('dragging');
        }

        function handleTouchMove(e) {
            if (!currentTouchedItem) return;
            e.preventDefault();

            const touch = e.touches[0];
            const currentY = touch.clientY;
            const items = [...document.querySelectorAll('.item')];
            const container = document.getElementById('list');
            
            // Get the item below the current touch position
            const elementBelow = document.elementFromPoint(touch.clientX, currentY);
            const itemBelow = elementBelow?.closest('.item');
            
            if (itemBelow && itemBelow !== currentTouchedItem) {
                const rect = itemBelow.getBoundingClientRect();
                const middleY = rect.top + rect.height / 2;
                
                if (currentY < middleY) {
                    container.insertBefore(currentTouchedItem, itemBelow);
                } else {
                    container.insertBefore(currentTouchedItem, itemBelow.nextSibling);
                }
            }
        }

        function handleTouchEnd(e) {
            if (!currentTouchedItem) return;
            currentTouchedItem.classList.remove('dragging');
            currentTouchedItem = null;
            resetStyles();
        }

        function handleDragStart(e) {
            draggedItem = this;
            this.classList.add('dragging');
            
            const ghost = this.cloneNode(true);
            ghost.style.position = 'absolute';
            ghost.style.top = '-1000px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 0, 0);
            setTimeout(() => document.body.removeChild(ghost), 0);
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
            draggedItem = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            if (this === draggedItem) return;
            
            const items = [...list.querySelectorAll('.item')];
            const draggedIndex = items.indexOf(draggedItem);
            const dropIndex = items.indexOf(this);
            
            if (draggedIndex < dropIndex) {
                this.parentNode.insertBefore(draggedItem, this.nextSibling);
            } else {
                this.parentNode.insertBefore(draggedItem, this);
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            resetStyles();
        }

        function checkOrder() {
            console.log("checkingorder");
            const items = [...document.querySelectorAll('.item')];
            const currentOrder = items.map(item => item.dataset.value);
            const messageEl = document.getElementById('f2');
            console.log(messageEl);
            let isCorrect = true;

            // Reset previous styles
            resetStyles();

            // Check each item
            items.forEach((item, index) => {
                if (item.dataset.value === correctOrder[index]) {
                    //item.classList.add('correct');
                } else {
                    //item.classList.add('incorrect');
                    isCorrect = false;
                }
            });

            // Show message
            if (isCorrect) {
                messageEl.textContent = "Szuper, helyes válasz! Minden nap előszőr a samast gyújtjuk meg, hogy nehogy a többi gyertya fényét használjuk. Ezután mindig a \"legfrisebb\" gyertyától a haladunk a legrégibb felé. Az ehhez a kérdéshez tartozó betű a J.";
                messageEl.className = "feedback correct";
                messageEl.style.display = 'flex';
            } else {
                messageEl.textContent = "Rossz válasz.";
                messageEl.className = "feedback incorrect";
                messageEl.style.display = 'flex';
            }
        }

        function resetStyles() {
            const items = document.querySelectorAll('.item');
            const messageEl = document.getElementById('f2');
            
            items.forEach(item => {
                item.classList.remove('correct', 'incorrect');
            });
            
            messageEl.style.display = 'none';
        }


/*
h3
*/
document.getElementById('latke-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Add your logic here to process the answers
    //alert('Quiz submitted! Add your scoring logic here.');
    // Get selected options
    const selectedOptions = Array.from(document.querySelectorAll('input[name="q1"]:checked'))
    .map(option => option.value);

// Correct answers
const correctAnswers = ['a', 'b'];

// Check if the selected answers match the correct answers
const isCorrect = selectedOptions.length === correctAnswers.length &&
                  selectedOptions.every(value => correctAnswers.includes(value));

// Show feedback
const feedback = document.getElementById('f3');
if (isCorrect) {
    feedback.textContent = 'Helyes válasz! Juditról itt tudtok többet olvasni: https://hu.wikipedia.org/wiki/Judit_k%C3%B6nyve Az ehhez a kéréshez tartozó betű az O.';
    feedback.classList.add('correct');
    feedback.classList.remove('incorrect');
} else {
    feedback.textContent = 'Hibás';
    feedback.classList.add('incorrect');
    feedback.classList.remove('correct');
}
feedback.style.display = 'flex';
});

/*
h4
*/

document.getElementById('kosher-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Add your logic here to process the answers
    //alert('Quiz submitted! Add your scoring logic here.');
    // Get selected options
    const selectedOptions = Array.from(document.querySelectorAll('input[name="q2"]:checked'))
    .map(option => option.value);
    console.log(selectedOptions);

// Correct answers
const correctAnswers = ['b', 'c', 'd', 'h'];

// Check if the selected answers match the correct answers
const isCorrect = selectedOptions.length === correctAnswers.length &&
                  selectedOptions.every(value => correctAnswers.includes(value));

// Show feedback
const feedback = document.getElementById('f4');
if (isCorrect) {
    feedback.textContent = 'Helyes válasz! A kóser hanukia gyertyáinak azonos, 3 (kb. 24 cm) és 10 (kb. 80 cm) tefách közötti magasságban kell lenniük. Az első hanukián különböző magasságban vannak a gyertyák, az ötödiken túl magasan, a hatodik egy menóra, nem egy hanukia (figyelem, egy menórát semmire sem szabad használni, még dekorációnak sem), a hetediken pedig megint különböző magasságokban vannak a gyertyák. A gyertyáknak nem kell egy egyenesre esniük, ezért a harmadik és negyedik hanukia is kóser. Az ehhez a kérdéshez tartozó betű az A.';
    feedback.classList.add('correct');
    feedback.classList.remove('incorrect');
} else {
    feedback.textContent = 'Rossz válasz.';
    feedback.classList.add('incorrect');
    feedback.classList.remove('correct');
}
feedback.style.display = 'flex';
});

/*
h5
*/

const input5 = document.getElementById('a5');
const feedback5 = document.getElementById('f5');
console.log(input);

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        check5Answer();
    }
});

function check5Answer() {
    const userAnswer = input5.value;
    console.log(userAnswer);
    console.log(input5.value);
    if (input5.value.length > 0) {
        feedback5.style.display = 'flex';
        
        //if (userAnswer === correctAnswer) {
            feedback5.textContent = "Jó válasz. Erre a kérdésre nem igazán tudjuk leellenőrizni a válaszodat. Sok magyarázat létezik erre a kérdésre, majd hanuka után kiteszünk egy rabbi által is megerősített választ a facebookunkra. Az ehhez a válaszhoz tartozó betű az A.";
            feedback5.className = 'feedback correct';
        //} else {
            //feedback.textContent = "Rossz válasz";
          //  feedback.className = 'feedback incorrect';
        //}
    }
}

/*
h6
*/
document.getElementById('hallel-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Add your logic here to process the answers
    //alert('Quiz submitted! Add your scoring logic here.');
    // Get selected options
    const selectedOptions = Array.from(document.querySelectorAll('input[name="q3"]:checked'))
    .map(option => option.value);
    console.log(selectedOptions);

// Correct answers
const correctAnswers = ['c'];

// Check if the selected answers match the correct answers
const isCorrect = selectedOptions.length === correctAnswers.length &&
                  selectedOptions.every(value => correctAnswers.includes(value));

// Show feedback
const feedback = document.getElementById('f6');
if (isCorrect) {
    feedback.textContent = 'Helyes válasz! Hanuka mindegyik napján teljes hallélt mondunk.Néhány szidurba rosszul van beleírva, mivel ros chódeskor általában fél hallélt mondunk kivéve akkor ha hanukára esik. Az ehhez a kérdéshez tartozó betű a D.';
    feedback.classList.add('correct');
    feedback.classList.remove('incorrect');
} else {
    feedback.textContent = 'Rossz válasz.';
    feedback.classList.add('incorrect');
    feedback.classList.remove('correct');
}
feedback.style.display = 'flex';
});
/*
h7
*/

document.getElementById('study-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Add your logic here to process the answers
    //alert('Quiz submitted! Add your scoring logic here.');
    // Get selected options
    const selectedOptions = Array.from(document.querySelectorAll('input[name="q4"]:checked'))
    .map(option => option.value);
    console.log(selectedOptions);

// Correct answers
const correctAnswers = ['b'];

// Check if the selected answers match the correct answers
const isCorrect = selectedOptions.length === correctAnswers.length &&
                  selectedOptions.every(value => correctAnswers.includes(value));

// Show feedback
const feedback = document.getElementById('f7');
if (isCorrect) {
    feedback.textContent = 'Gratulálok jó válasz. A tanulás fontos, ritkán nem szoktunk tanulni például Tisa Beávkor. 	Kevés helyen tartják a Nittel Nachtot (a karácsonyi nem tanulást) itt olvashattok róla többet (sajnos csak angolul): https://en.wikipedia.org/wiki/Nittel_Nacht Az ehhez a kérdéshez tertozó betű az O.';
    feedback.classList.add('correct');
    feedback.classList.remove('incorrect');
} else {
    feedback.textContent = 'Rossz válasz.';
    feedback.classList.add('incorrect');
    feedback.classList.remove('correct');
}
feedback.style.display = 'flex';
});
