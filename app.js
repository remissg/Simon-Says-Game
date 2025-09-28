let gameSeq = [];
let userSeq = [];

let btns = ["red" , "green" , "yellow" , "blue"];

let started = false;
let level = 0;
let highestScore = 0; 

let h2 = document.querySelector("h2");
let startButton = document.querySelector("#startButton"); // Get the new button


const audioMap = {
    red: new Audio("sounds/red.mp3"),
    green: new Audio("sounds/green.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    blue: new Audio("sounds/blue.mp3"),
    gameover: new Audio("sounds/gameover.mp3"),
    start: new Audio("sounds/start.mp3") 
};

function playSound(color) {
    if (audioMap[color]) {
        audioMap[color].currentTime = 0;
        audioMap[color].play();
    }
}




// *** Event Listener for Start Button Click ***
startButton.addEventListener("click", function startGame() {
    if (started == false) {
        h2.innerText = "Game is starting..."; 
        playSound("start"); 
        console.log("game is started");
        started = true;
        startButton.classList.add("hide"); // Hide the start button

        // Wait for start audio to finish before starting the game
        audioMap.start.onended = function () {
            levelUp();
            audioMap.start.onended = null;
        };
    }
});

document.addEventListener("keypress", function () {
    if (started == false) {
        h2.innerText = "Game is starting..."; // Show message while start music plays
        playSound("start"); // Play start audio
        console.log("game is started");
        started = true;

        // Wait for start audio to finish before starting the game
        audioMap.start.onended = function () {
            levelUp();
            // Remove the handler so it doesn't trigger again
            audioMap.start.onended = null;
        };
    }
})

function gameFlash(btn){
    btn.classList.add("flash");
    playSound(btn.getAttribute("id"));
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn){
    btn.classList.add("flash");
    playSound(btn.getAttribute("id"));
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 250);
}

function levelUp(){
    userSeq = [];
    level++;

    // Display level and highest score in the h2
    h2.innerHTML = `Level ${level} `; 

    // random btn choose
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    // Use the class selector for the button
    let randBtn = document.querySelector(`.${randColor}`); 
    gameSeq.push(randColor);
    console.log(gameSeq);
    gameFlash(randBtn);
}

function checkAns (idx){
    if(userSeq[idx] === gameSeq[idx]){
        if(userSeq.length == gameSeq.length){
            setTimeout(levelUp , 1000);
        }
    }
    else{
        // Update highest score if current level is greater than the recorded highest score
        if(level > highestScore){
            highestScore = level - 1; 
        } else if (level === 1) {
             highestScore = Math.max(highestScore, 0); 
        }
        
        playSound("gameover"); 
        // Display Game Over message with current score and highest score
        h2.innerHTML = `Game Over! Your score is <b>${level - 1}</b>.<br> Highest: <b>${highestScore}</b>.<br>Press the START button to play again.`;
        
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        
        reset();
    }
}

function btnPress(){
    if (!started) return; // Ignore button presses if the game hasn't started
    
    let btn = this;
    userFlash(btn);
    
    userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    console.log(userSeq);

    checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");

for (let btn of allBtns){ // Use 'let' for block scoping
    btn.addEventListener("click" , btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    // Only show the start button if on mobile (screen width <= 1025)
    if (window.innerWidth <= 1025) {
        startButton.classList.remove("hide");
    } else {
        startButton.classList.add("hide");
    }
}


function setupForScreenSize() {
    if (window.innerWidth <= 1025) {
        // Mobile: Show Start button, hide keypress, set h2
        h2.innerText = "Press Start to Start the Game";
        startButton.classList.remove("hide");
        document.removeEventListener("keypress", keypressStartHandler);
    } else {
        // Laptop/Desktop: Hide Start button, enable keypress, set h2
        h2.innerText = "Press any key to start the game";
        startButton.classList.add("hide");
        document.addEventListener("keypress", keypressStartHandler);
    }
}

// Extract keypress handler so it can be added/removed
function keypressStartHandler() {
    if (started == false) {
        h2.innerText = "Game is starting...";
        playSound("start");
        started = true;
        audioMap.start.onended = function () {
            levelUp();
            audioMap.start.onended = null;
        };
    }
}

// Remove the old keypress event listener (if any)
document.removeEventListener("keypress", keypressStartHandler);

// Initial setup
setupForScreenSize();

// Re-setup on window resize
window.addEventListener("resize", setupForScreenSize);
window.addEventListener("orientationchange", setupForScreenSize);