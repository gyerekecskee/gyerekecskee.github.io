const container = document.querySelector('.images');


let translateValue = 0;

function moveImages() {
    const images = document.querySelectorAll('.images img');
    const imageRect = images[0].getBoundingClientRect(); // Adjust 10 to the margin-right value in CSS
    //container.style.transform = `translateX(${translateValue}px)`;

    // Check if the leftmost image is out of view
    if (imageRect.right < 0) {
        const removedImage = container.removeChild(images[0]);
        container.appendChild(removedImage); // Add the removed image to the right side
        translateValue = 0;
        container.style.transform = `translateX(${translateValue}px)`;
    }
}

function startMoveEffect() {
    intervalId = setInterval(moveImages, 1000);
  }
  
  function stopMoveEffect() {
    clearInterval(intervalId);
  }
  
  // Trigger the startMoveEffect function on mouseover
  container.addEventListener('mouseover', startMoveEffect);
  
  // Trigger the stopMoveEffect function on mouseout
  container.addEventListener('mouseout', stopMoveEffect);