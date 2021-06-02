cardsList = ["posters/fastandfurious-poster.jpg",
    "posters/godfather-poster.jpg",
    "posters/huntforthewilderpeople-poster.jpg",
    "posters/meninblack3-poster.jpg",
    "posters/sherlockholmes2-poster.jpg",
    "posters/peppa.jpg",
    "posters/fastandfurious-poster.jpg",
    "posters/godfather-poster.jpg",
    "posters/huntforthewilderpeople-poster.jpg",
    "posters/meninblack3-poster.jpg",
    "posters/sherlockholmes2-poster.jpg",
    "posters/peppa.jpg"];
clickTimes = new Array(12).fill(0);
matchedCheck = new Array(12).fill(false);
attemptTimes = 0;
matchNum = 0;
window.onload = function (){
    cards = document.querySelectorAll('.card');
    attempts = document.querySelector("#attempts");
    matches = document.querySelector("#matches");
    updateResults();
    shuffleCards();
}

// flip cards
function flipped(e){
    var card = e.target.parentElement;
    card.classList.toggle("flipped");
    if (clickTimes[parseInt(card.id)] == 0){
        clickTimes[parseInt(card.id)]++;
    }else {
        clickTimes[parseInt(card.id)] = 0;
    }
    console.log(clickTimes);
    setTimeout(function (){
        cardsMatching();
    },400);
}

// flip all cards to the front
function flipBack(){
    for (var i = 0; i < clickTimes.length; i++){
        if (clickTimes[i] == 1){
            cards[i].classList.toggle("flipped");
        }
    }
    clickTimes.fill(0);
}

// restart the game
function restart(){
    matchNum = 0;
    attemptTimes = 0;
    updateResults();
    flipBack();
    clickTimes = new Array(12).fill(0);
    matchedCheck = new Array(12).fill(false);
    // shuffleCards();
}

// shuffle array
function shuffleArr(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}

// shuffle cards
function shuffleCards(){
    flipBack();
    shuffleArr(cardsList);
    matchNum = 0;
    attemptTimes = 0;
    updateResults();
    setTimeout(function (){
        for (var i = 0; i < cardsList.length; i++){
            var back = cards[i].querySelector(".back");
            cards[i].addEventListener("click", flipped, false);
            cards[i].setAttribute("id", i);
            back.setAttribute("src", cardsList[i]);
        }
    }, 500);
}

// cards matching
function cardsMatching(){
    var temp = [];
    var index = [];
    for (var i = 0; i < clickTimes.length; i++){
        if (clickTimes[i] == 1 && matchedCheck[i] == false){
            var figure = cards[i].querySelector(".back");
            temp.push(figure.src);
            index.push(i);
        }
    }
    if (temp.length == 2) {
        attemptTimes++;
        updateResults();
        if (temp[0] == temp[1]) {
            matchNum++;
            updateResults();
            matchedCheck[index[0]] = true;
            matchedCheck[index[1]] = true;
        } else {
            temp = [];
            cards[index[0]].classList.toggle("flipped");
            clickTimes[index[0]] = 0;
            cards[index[1]].classList.toggle("flipped");
            clickTimes[index[1]] = 0;
            index = [];
        }
    }
    if (matchNum == 6){
        var message ="Congratulations! You won!";
        alert(message);
        shuffleCards();
    }
}

// update matches and attempts
function updateResults(){
    attempts.textContent = "Attempts: " + attemptTimes;
    matches.textContent = "Matches: " + matchNum;
}