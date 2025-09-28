let gameSeq = [];
let userSeq = [];

let btns = ["red" , "green" , "yellow" ,  "blue"];

let started = false;
let level = 0;
let highestScore = 0; // Add this line

let h2 = document.querySelector("h2");

// Audio setup
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
    level ++;
    h2.innerText = `Level ${level}`; // Show highest score

    // random btn choose
    let randIdx =  Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
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
        // Update highest score if current level is greater
        if(level > highestScore){
            highestScore = level;
        }
        playSound("gameover"); // Play game over sound
        h2.innerHTML = `Game Over! Your score is <b>${level}</b> <br>Highest Score: <b>${highestScore}</b><br>Press any key to start.`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function btnPress(){
    let btn = this;
    // console.log(this);
    userFlash(btn);
    
    userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    console.log(userSeq);

    checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");

for (btn of allBtns){
    btn.addEventListener("click" , btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}