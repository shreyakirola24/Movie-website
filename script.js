const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const wishlistItems = document.getElementById('wishlist-items'); // Wishlist display area
let wishlist = []; 

async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=79f27e7a`; // Fixed URL
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response === "True") displayMovieList(data.Search);
}

// Find movies based on the input
function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Display list of movie suggestions
function displayMovieList(movies) {
    searchList.innerHTML = "";
    movies.forEach(movie => {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID; // Setting movie id in data-id
        movieListItem.classList.add('search-list-item');

        let moviePoster = (movie.Poster !== "N/A") ? movie.Poster : "image_not_found.png";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="Movie Poster">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <button class="add-to-wishlist" onclick="addToWishlist('${movie.imdbID}', '${movie.Title}', '${movie.Poster}', event)">Add to Wishlist</button>
            </div>
        `;
        searchList.appendChild(movieListItem);
    });

    loadMovieDetails();
}

// Load movie details for the clicked movie
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";  // Clear the search box
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=79f27e7a`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

// Display detailed information about a movie
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="Movie Poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
            <button onclick="addToWishlist('${details.imdbID}', '${details.Title}', '${details.Poster}', event)">Add to Wishlist</button>
        </div>
    `;
}

// Function to add a movie to the wishlist
function addToWishlist(movieID, movieTitle, posterUrl, event) {
    event.stopPropagation(); // Prevent the button's default action (if any)

    // Check if the movie is already in the wishlist
    if (!wishlist.some(item => item.id === movieID)) {
        // Add movie to wishlist array with additional details
        wishlist.push({
            id: movieID,
            title: movieTitle,
            poster: posterUrl
        });

        // Update the wishlist display
        displayWishlist();

        // Notify the user
        alert(`${movieTitle} has been added to your wishlist!`);
    } else {
        alert(`${movieTitle} is already in your wishlist!`); // Notify if already in wishlist
    }
}

// // Function to display the wishlist
function displayWishlist() {
    const wishlistSection = document.getElementById('wishlist-section');
    wishlistSection.innerHTML = '<h2 style="color: white;">My Wishlist</h2>'; // Reset the wishlist section

    // Append each movie in the wishlist
    wishlist.forEach(movie => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('wishlist-item');
        wishlistItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster" style="width: 100px; border-radius: 5px;">
            <h4 style="color: white;">${movie.title}</h4>
            <button onclick="removeFromWishlist('${movie.id}')">Remove</button>
        `;

        wishlistSection.appendChild(wishlistItem);
    });
}

// Remove a movie from the wishlist
function removeFromWishlist(movieID) {
    wishlist = wishlist.filter(item => item.id !== movieID); // Remove the movie ID from the wishlist
    displayWishlist(); // Update the wishlist display
    alert("Movie has been removed from your wishlist!"); // Notify the user
}

// Hide the search list if clicked outside
window.addEventListener('click', (event) => {
    if (!searchList.contains(event.target) && event.target !== movieSearchBox) {
        searchList.classList.add('hide-search-list');
    }
});




