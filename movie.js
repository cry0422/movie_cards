playing = false;
muted = false;
clicking = false;
playAllMode = false;
initialVolume = 0.5;
movieList = ["movies/fastandfurious-trailer.mov","movies/Godfather-trailer.mov",
    "movies/huntforthewilderpeople-trailer.mov","movies/meninblack3-trailer.mov",
    "movies/sherlockholmes2-trailer.mov"];
posterList = ["posters/fastandfurious-poster.jpg","posters/godfather-poster.jpg",
    "posters/huntforthewilderpeople-poster.jpg","posters/meninblack3-poster.jpg",
    "posters/sherlockholmes2-poster.jpg"];
movieIndex = 0;
window.onload = function(){
    // initialize movie
    movie = document.querySelector("#movie");
    movie.setAttribute("src", movieList[movieIndex]);
    movie.setAttribute("poster", posterList[movieIndex]);
    movie.addEventListener('timeupdate', updatePlayBar, false);
    // initialize button
    playButton = document.querySelector("#play");
    muteButton = document.querySelector("#muted");
    playAllBtn = document.querySelector('#playAll');
    // initialize movie progress
    bar = document.querySelector('#bar');
    progress = document.querySelector('#progress');
    progress.addEventListener('click', moveSeek, false);
    // initialize previous and next img
    previous = document.querySelector("#previous");
    next = document.querySelector("#next");
    changeButtonImg();
    // player
    player = document.querySelector(".movie_player");
    // movie_form
    movieForm = document.querySelector(".movie_lists");
    updateMovieForm();
    // movie title
    movieTitle = document.querySelector("#movieName");
    movieTitle.textContent = movieList[movieIndex].slice(7);
    // controls_bar
    controls = document.querySelector(".controls");
    // full screen
    fullScreenBtn = document.querySelector('#fullScreen');
    // timer
    durationTimer = document.querySelector('#duration_timer');
    progressTimer = document.querySelector('#progress_timer');
    movie.addEventListener("canplay", function (){
        totalT = this.duration;
        var vedioDuration = formatTime(totalT);
        durationTimer.innerHTML = vedioDuration;
    })
    movie.addEventListener('timeupdate',function(){
        presentT = this.currentTime;
        var videoCurrent = formatTime(presentT);
        progressTimer.innerHTML = videoCurrent;
    })
    // volume
    volumeBtn = document.querySelector('#muted');
    volumeContorls = document.querySelector('.volume_control');
    volumeBtn.addEventListener('mouseenter', function (){
        volumeContorls.style.visibility = "visible";
    });
    volumeBtn.addEventListener('mouseleave', function (){
        setTimeout(function (){
            if (clicking == false){
                volumeContorls.style.visibility = "hidden";
            }
        }, 1500)
    })
    volumeContorls.addEventListener('mouseenter', function (){
        clicking = true;
    })
    volumeContorls.addEventListener('mouseleave', function (){
        clicking = false;
        volumeContorls.style.visibility = "hidden";
    })
    volumeRange = volumeContorls.querySelector('#volume');
    volumeRange.addEventListener('change', volumeChange, false);
    movie.volume = volumeRange.value;
    checkForm(movieIndex);
    reloadMovie();
}

// method to play movie
function playMovie(){
    if (playing == false){
        movie.play();
        playing = true;
        playButton.style.backgroundImage = "url('materials/pause.png')";
        movieTitle.textContent = movieList[movieIndex].slice(7);
    }
    else{
        movie.pause();
        playing = false;
        playButton.style.backgroundImage = "url('materials/play.png')";
    }
}
// reload movie
function reloadMovie(){
    movie.addEventListener('ended',function(){
        movie.load();
        playing = false;
        playButton.style.backgroundImage = "url('materials/play.png')";
        bar.style.width = 0;
        // playMovie();
    },false);
}
// method to change volume
function volumeChange(){
    movie.volume = volumeRange.value;
    if (movie.volume == 0){
        muteMovie();
    }
    else{
        muted = false;
        movie.muted = false;
        muteButton.style.backgroundImage = "url('materials/non-muted.png')";
    }
}
// method to turn up ,down the volume
// function volumeUp(){
//     if (movie.volume < 1){
//         movie.volume += 0.1;
//     }
// }
//
// function volumeDown(){
//     if (movie.volume > 0){
//         movie.volume -= 0.1;
//     }
// }

// method to mute movie
function muteMovie() {
    var previousVolume = movie.volume;
    if (muted == false){
        movie.muted = true;
        muted = true;
        volumeRange.value = 0;
        muteButton.style.backgroundImage = "url('materials/muted.png')";
    }
    else{
        movie.muted = false;
        muted = false;
        volumeRange.value = previousVolume;
        muteButton.style.backgroundImage = "url('materials/non-muted.png')";
    }
}

// method to use the play bar
function updatePlayBar(){
    bar.style.width = parseInt(((movie.currentTime / movie.duration) * 100), 10) + "%";
}

function moveSeek(e){
    var clickPosition = (e.pageX - this.offsetLeft) / this.offsetWidth;
    var clickTime = clickPosition * movie.duration;
    // move the playhead to the correct position
    movie.currentTime = clickTime;
}

//method to change the image of previous and next button
function changeButtonImg(){
    if (movieIndex > 0 && movieIndex < movieList.length - 1){
        previous.setAttribute("src", posterList[movieIndex-1]);
        next.setAttribute("src", posterList[movieIndex+1]);
    }
    else if (movieIndex == 0){
        previous.setAttribute("src", posterList[movieList.length-1])
        next.setAttribute("src", posterList[movieIndex+1]);
    }
    else{
        previous.setAttribute("src", posterList[movieIndex-1]);
        next.setAttribute("src", posterList[0]);
    }
}

function previousMovie(){
    if (movieIndex <= 0){
        movieIndex = movieList.length;
    }
    movieIndex--;
    movie.setAttribute("src", movieList[movieIndex]);
    movie.setAttribute("poster", posterList[movieIndex]);
    playing = false;
    playMovie();
    changeButtonImg();
    checkForm(movieIndex);
}

function nextMovie(){
    if (movieIndex >= movieList.length - 1){
        movieIndex = -1;
    }
    movieIndex++;
    movie.setAttribute("src", movieList[movieIndex]);
    movie.setAttribute("poster", posterList[movieIndex]);
    playing = false;
    playMovie();
    changeButtonImg();
    checkForm(movieIndex);
}

function playAll(){
    if (playAllMode == false){
        // movieIndex = 0;
        // movie.setAttribute("src", movieList[movieIndex]);
        // movie.setAttribute("poster", posterList[movieIndex]);
        movie.addEventListener('ended', nextMovie, false);
        playAllBtn.style.backgroundImage = "url('materials/playAll.png')";
        playAllBtn.style.width = '40px';
        playAllMode = true;
        // playMovie();
        // changeButtonImg();
        // checkForm(movieIndex);
    }
    else{
        playAllMode = false;
        movie.removeEventListener('ended', nextMovie, false);
        playAllBtn.style.backgroundImage = "url('materials/playCycle.png')";
        playAllBtn.style.width = '47px';
    }
}

function fullScreen(){
    var isFullScreen = document.fullscreen;
    var button = controls.querySelector('#volume_up');
    if (isFullScreen == false){
        player.requestFullscreen();
        movie.style.height = "90%";
        setTimeout(function (){
            fullScreenBtn.style.backgroundImage = "url('materials/ExitFull.png')";
        }, 500);

    }
    else {
        document.exitFullscreen();
        setTimeout(function (){
            movie.style.height = "500px";
            fullScreenBtn.style.backgroundImage = "url('materials/fullScreen.png')";
        }, 500);
    }
}

function updateMovieForm(){
    for (var i = 0; i < movieList.length; i++){
        var movieInfo = document.createElement("div");
        var movieImg = document.createElement("img");
        var movieName = document.createElement("p");
        movieInfo.id = i;
        movieInfo.style.border = "5px solid #1F272A";
        movieInfo.style.display = "inline-flex";
        movieInfo.style.width = "50%";
        movieInfo.style.marginLeft = "25%";
        movieInfo.style.marginRight = "50%";
        movieInfo.style.backgroundColor = "#1F272A";
        movieInfo.style.borderRadius = "16px";
        movieInfo.style.marginTop = "10px";
        movieImg.style.width = "150px";
        movieImg.style.height = "150px";
        movieImg.style.borderRadius = "16px";
        movieImg.src = posterList[i];
        movieImg.id = i;
        movieName.innerText = movieList[i].slice(7);
        movieName.id = i;
        movieName.style.color = "#ffffff";
        movieName.style.fontSize = "x-large";
        movieInfo.appendChild(movieImg);
        movieInfo.appendChild(movieName);
        movieInfo.addEventListener('click', formClick, false);
        movieForm.appendChild(movieInfo);
    }
}

function formClick(e){
    for (var i = 0; i < movieList.length; i++){
        if (i == e.target.id){
            movieIndex = i;
            movie.setAttribute("src", movieList[movieIndex]);
            movie.setAttribute("poster", posterList[movieIndex]);
            playing = false;
            playMovie();
            checkForm(movieIndex);
            changeButtonImg();
        }
    }
}

function formatTime(t){
    var h = parseInt(t/3600)
    h = h<10?'0'+h:h
    var m = parseInt(t%3600/60)
    m = m<10?'0'+m:m
    var s = parseInt(t%60)
    s = s<10?'0'+s:s
    return h+':'+m+':'+s
}

function checkForm(index){
    for (var i = 0; i < movieList.length; i++){
        var playingMovie = document.getElementById(i);
        var playingName = playingMovie.lastChild;
        if (index == i){
            playingMovie.style.borderColor = '#FF8C00';
            playingName.style.color = '#FF8C00';
        }
        else{
            playingMovie.style.borderColor = "#1F272A";
            playingName.style.color = '#ffffff';
        }
    }
}