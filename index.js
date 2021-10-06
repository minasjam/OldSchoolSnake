const grid = document.querySelector('.grid')
const startBtn = document.getElementById("start-btn")
const pauseBtn =  document.getElementById("pause-btn")
const scoreDisplay = document.getElementById("score")
const highDisplay = document.getElementById("high")
const message = document.getElementById("message")
let squares = []
let currentSnake = []
let direction = 0
let prevDirection = 0
let running = true
let width = 10
let head = 0
let appleIndex = 0
let interval = 1000
let initialInterval = interval
let high = 0
let score = 0
let speed  = 0.9
let timerID = 0
let gameOver = false

// creates a grid in which the snake will move
createGrid()

// načti nejvyšší skóre
if (localStorage.getItem("high")){
    high = localStorage.getItem("high")
    highDisplay.textContent = high;
}



// a key was pushed
document.addEventListener("keydown", event => control(event))

// the pause btn was pushed
pauseBtn.addEventListener("click", pauseTheGame)

// the start btn was pushed
startBtn.addEventListener("click", () => startGame())

function move(){
    //stop the game if the snake hits something
    if( head - width < 0 && direction === -width|| //walls N,E,S,W
        head % width === width-1 && direction === +1|| 
        head + width >= width*width && direction === +width|| 
        head %  width=== 0 && direction === -1|| 
        squares[head + direction].classList.contains('snake') && direction !== -prevDirection //itself
        ) {
        // so that you cant restart the game with the "pause" button
        gameOver = true 

        // let the player know the game ended
        if (score > high){ 
            high = score
            localStorage.setItem("high", high)
            highDisplay.textContent = high
            message.textContent = "Congratulations, New HIGH SCORE!"
        } else {
            message.textContent = "Sorry, you LOST!"
        }
        message.style.display = "block"

        return clearInterval(timerID) //zastav hru
    } 
    
    //prevention against going the opposite direction from your current one - it would be trouble
    if (direction === -prevDirection){ 
        direction = -direction
    }

    // displays the snake after his step forward
    let tail = currentSnake.pop(); 
    squares[tail].classList.remove('snake')
    head =currentSnake[0] + direction 
    squares[head].classList.add('snake') 
    currentSnake.unshift(head);

    // the snake ate an apple :-)
    if(head === appleIndex){
        // the snake grows and a new apple appears
        squares[appleIndex].classList.remove("apple")
        currentSnake.push(tail)
        generateApples()
        score ++
        scoreDisplay.textContent = score

        // the snake got faster
        clearInterval(timerID)
        interval = interval * speed
        timerID = setInterval(move, interval)
    }

    // needed for prevention against going in the opposite direction from the current one 
    prevDirection = direction
}


// moves the snake after keyboard click
function control(event){
    switch(event.key){
        case "ArrowUp" :
            direction = -width 
            break 
        case "ArrowRight" :  
            direction = 1
            break
        case "ArrowDown" :  
            direction = width
            break
        case "ArrowLeft" : 
            direction = -1 
            break
        case "p":
            pauseTheGame()
            break
    }
}

//generates a new apple
function generateApples(){
    appleIndex = Math.floor(Math.random() * width * width);
    
    let squareIsUsed = false
    let i = 0

    // checks if the apple hasn't appeared inside the snake
    while (i < currentSnake.length && !squareIsUsed){
        if (appleIndex === currentSnake[i]){
            squareIsUsed = true
        }
        i++
    }

    // displays the apple
    if (squareIsUsed){
        generateApples();
    } else {
        squares[appleIndex].classList.add('apple');
    }
}


//pauses and unpauses the game
function pauseTheGame (){
    if (running && !gameOver){
        clearInterval(timerID)
        running = false
    } else if (!gameOver){
        timerID = setInterval(move, interval);
        running = true
    }
}

// creates a grid in which the snake moves (once. when the page loads)
function createGrid(){
    for (let i = 0; i < width*width; i++ ){
        const square = document.createElement('div')
        square.classList.add("square")
        grid.appendChild(square)
        squares.push(square)
    }
}

function startGame(){
    //RESTART PART
    // resets the scoreboard
    score = 0
    scoreDisplay.textContent = score
    message.style.display = "none"
    
    //clear the board
    for(let i=0; i< currentSnake.length; i++){
        squares[currentSnake[i]].classList.remove("snake")
    }
    squares[appleIndex].classList.remove("apple")
    
    //deletes the old snake from records
    let snakeLength =currentSnake.length
    for(let i=0; i< snakeLength; i++){
        currentSnake.pop()
    }

    // START PART
    //creates and displays a new snake
    currentSnake = [33,32,31]
    head = currentSnake[0]
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    
    // starts the movement of snake
    direction = 1
    prevDirection = direction
    clearInterval(timerID)
    interval = initialInterval
    timerID = setInterval(move, interval);

    //generate an apple
    generateApples()

    gameOver = false
}


//HINTS:
// const timerId = setInterval(function, time)
// clearInterval(timerId)


//TEST DATA: 
//Huge snake:
// for (let i = 9 ; i >= 2; i--){
    //     for (let j=0; j <10; j++){
    //         if (i%2 === 1){
    //             currentSnake.unshift(i*10 + 9 - j)
    //         } else {
    //             currentSnake.unshift(i*10 + j)
    //         }
    //     }
    // }
// direction = -10
    