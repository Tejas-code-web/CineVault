let movie = document.querySelector("#movie");
let searchBtn = document.querySelector("#searchbtn");
let result = document.querySelector("#result");
let details = document.querySelector("#details");
let favorite = document.querySelector("#favsec");
let error = document.querySelector("#error");
let list = document.querySelector("#list");

let apiKey = "YOUR_API_KEY";
let url = "https://www.omdbapi.com/";

async function showMovieDetails(imdbID){
    try{
    let imdbIdUrl = url+"?apikey="+apiKey+"&i="+imdbID;
    details.innerText = "Loading movie details...";
    let imdbIdResponse = await fetch(imdbIdUrl);
    let imdbIdData = await imdbIdResponse.json();
    details.innerHTML = "";
    let detailPoster =document.createElement("img");
            detailPoster.src = imdbIdData.Poster;
            if(imdbIdData.Poster === "N/A"){
                detailPoster.src = "https://via.placeholder.com/230x300?text=No+Poster";
            }
            detailPoster.alt = imdbIdData.Title;
            let detailTitle = document.createElement("h2");
            detailTitle.innerText = imdbIdData.Title;
            let detailinfo = document.createElement("p");
            detailinfo.innerText = "Year: "+ imdbIdData.Year;
            let detailImdb = document.createElement("p");
            detailImdb.innerText = "IMDb Rating: "+imdbIdData.imdbRating;
            let detailGenre = document.createElement("p");
            detailGenre.innerText = "Genre: "+imdbIdData.Genre;
            let detailRuntime = document.createElement("p");
            detailRuntime.innerText = "Runtime: "+imdbIdData.Runtime;
            let director = document.createElement("p");
            director.innerText = "Director: "+imdbIdData.Director;
            let actors = document.createElement("p");
            actors.innerText = "Cast: "+imdbIdData.Actors;
            let plot = document.createElement("p");
            plot.innerText = "Plot: "+imdbIdData.Plot;
            let imdbLink = document.createElement("a");
            imdbLink.innerText = "View on IMDb";
            imdbLink.href = "https://www.imdb.com/title/"+imdbIdData.imdbID;
            imdbLink.target = "_blank";
            imdbLink.rel = "noopener noreferrer";
            let closeDetails = document.createElement("button");
            closeDetails.innerText = "Close Details";
            closeDetails.addEventListener("click",()=>{
                details.innerHTML = "";
            });
            details.append(detailPoster);
            details.append(detailTitle);
            details.append(detailinfo);
            details.append(detailImdb);
            details.append(detailGenre);
            details.append(detailRuntime);
            details.append(director);
            details.append(actors);
            details.append(plot);
            details.append(closeDetails);
            details.append(imdbLink);
        }
        catch(err){
            details.innerText = "Unable to load movie details. Please try again.";
        }
}

async function searchMovie(){
    let inputMovie = movie.value;
    if(inputMovie === ""){
        error.innerText = "Please, Enter a Movie.";
        return;
    }
    try{  
    error.innerHTML = "";
    result.innerHTML = "";
    error.innerText = "Searching For Movie....";
    let encodedMovie = encodeURIComponent(inputMovie);
    let apiUrl = url+"?apikey="+apiKey+"&s="+encodedMovie;
    let response = await fetch(apiUrl);
    let data = await response.json();
    error.innerHTML = "";
    if(data.Response === "False"){
        error.innerText = data.Error;
        return;
    }
    for(let movieData of data.Search){
        let card = document.createElement("article");
        card.dataset.imdbID = movieData.imdbID;
        let imdbUrl = url+"?apikey="+apiKey+"&i="+movieData.imdbID;
        let imdbResponse = await fetch(imdbUrl);
        let imdbData = await imdbResponse.json(); 
        let poster = document.createElement("img");
        poster.src = movieData.Poster;
        if(movieData.Poster === "N/A"){
            poster.src = "https://via.placeholder.com/230x300?text=No+Poster";
        }
        poster.alt = movieData.Title;
        let title = document.createElement("h2");
        title.innerText = movieData.Title;
        let info = document.createElement("p");
        info.innerText = movieData.Year;
        let imdb = document.createElement("p");
        imdb.innerText = imdbData.imdbRating;
        let favbtn = document.createElement("button");
        favbtn.innerText = "Add To Favorites";
        favbtn.addEventListener("click",(event)=>{
            event.stopPropagation();
            let favoriteMovie = JSON.parse(localStorage.getItem("favorites")) || [];
            let favObj = {
                imdbID: movieData.imdbID,
                Title: movieData.Title,
                Poster: movieData.Poster,
                Year: movieData.Year
            };
            let alreadyFav = favoriteMovie.some(movie=>movie.imdbID === movieData.imdbID);
            if(!alreadyFav){
            favoriteMovie.push(favObj);
            localStorage.setItem("favorites",JSON.stringify(favoriteMovie));
            displayFav();
            }
            else{
                error.innerText = "Movie is already in Favorites.";
            }
        });
        card.append(poster);
        card.append(title);
        card.append(info);
        card.append(imdb);
        card.append(favbtn);
        card.addEventListener("click",async()=>{
            let clickImdbId = card.dataset.imdbID;
            showMovieDetails(clickImdbId);
        });
        result.append(card);
    }
}
catch(err){
    error.innerHTML = "";
    error.innerText =  "Something went wrong. Please try again."
}  
}

searchBtn.addEventListener("click",()=>{
      searchMovie();
});

movie.addEventListener("keydown",(event)=>{
   if(event.key === "Enter"){
    searchMovie();
   }
});

function displayFav(){
    let favMovie = JSON.parse(localStorage.getItem("favorites")) || [];
    favorite.innerHTML = "";
    let favHeading = document.createElement("h2");
    favHeading.innerText = "Favorites";
    favorite.append(favHeading);
    for(let displayMovie of favMovie)
    {
        let displayCard = document.createElement("article");
        displayCard.addEventListener("click",async ()=>{
            let clickImdbId = displayMovie.imdbID;
           showMovieDetails(clickImdbId);
        });
        let displayPoster = document.createElement("img");
        displayPoster.src = displayMovie.Poster;
        if(displayMovie.Poster === "N/A"){
            displayPoster.src = "https://via.placeholder.com/230x300?text=No+Poster";
        }
        displayPoster.alt = displayMovie.Title;
        let displayTitle = document.createElement("h2");
        displayTitle.innerText = displayMovie.Title;
        let displayYear = document.createElement("p");
        displayYear.innerText = displayMovie.Year;
        displayCard.append(displayPoster);
        displayCard.append(displayTitle);
        displayCard.append(displayYear);
        let removefav = document.createElement("button");
        removefav.innerText = "Remove";
        removefav.addEventListener("click",(event)=>{
            event.stopPropagation();
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            favorites = favorites.filter(movie=>movie.imdbID !== displayMovie.imdbID);
            localStorage.setItem("favorites",JSON.stringify(favorites));
            displayFav();
        });
        displayCard.append(removefav);
        favorite.append(displayCard);
    }
}

displayFav();

