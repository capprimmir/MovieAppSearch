
let apiKey = "4ca250b53671cc98a1d81e3f08d5b6bb";
let baseUrl = "https://api.themoviedb.org/3/";
let imageBaseUrl = null;
let movieImage = null;

//function to get the user input using jQuery
$(document).ready(function() {
    $("#formInput").on("submit", function(e){

        //variable to hold movie title entered by user
        var movieTitle = ($("#movieTitle").val());

        
        getConfig();
        //call a function that will search for the movie
        searchMovies(movieTitle);

        //prevent the form from submit 
        e.preventDefault();
    });
});//end $document

//function to get config data for images
function getConfig(){
    axios.get(baseUrl+"configuration?api_key="+apiKey)
    .then(function(response){
        console.log(response);
        
        imageBaseUrl = response.data.images.secure_base_url;
        //posterSize = data.poster_sizes[4];

    })
    .catch(function(error){
        console.log(error);
    });//end catch
    
}

//function to get movies
function searchMovies(movieTitle){
    //test
    console.log("The movie your are looking for is: " + movieTitle);

    //make a requesto to The Movie DB API using axios
    axios.get(baseUrl+"search/movie?api_key="+apiKey+"&language=en-US&query="+movieTitle)
        .then(function(response) {
            console.log(response);

            //variables that holds results from the api.
            let movies = response.data.results;        
            let movieImage = imageBaseUrl+"w500";

            console.log(movies == 0);

            //check if no movies were found
            if(movies == 0){
    
                let message = `
                    <div class="alert alert-warning" role="alert">
                        <h3 class="text-center">OOPS! The movie you requested was not found!</h3><br/>
                        <h3 class="text-center">Please try another search</h4>
                    </div>
                `;
                $("#movieNotFound").html(message);
            }

            //variable used to display the movies found.
            let output = '';

            //loop throught each movie 
            $.each(movies, function(index, movie){
                output += `
                    <div class="col-md-3">
                        <div class="card">
                            <img class="card-img-top" src="${movieImage}${movie.poster_path}"></img>
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
                            </div>
                        </div>
                    </div>
                `;
            });//end each loop

            //output the results in the .html
            $("#movieResults").html(output);
        })
        .catch(function(error){
            console.log(error);
    });//end axios
}

//function to store details about the movie
function movieSelected(movieId){
    sessionStorage.setItem("id", movieId);
    window.location = "singleMovie.html";
    return false;
}

//function that will get the details for the single movie
function getMovieDetails(){
    //get the id from session storage
    let movieId = sessionStorage.getItem("id");

    //make another request using axios
    axios.get(baseUrl+"movie/"+movieId+"?api_key="+apiKey+"&language=en-US")
        .then(function(response) {
            console.log(response);
            let movie = response.data;

            //variable used to get image
            let movieImageUrl = "https://image.tmdb.org/t/p/w300";


            //output the movie data into the page 
            let movieDetails = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${movieImageUrl}${movie.poster_path}"/>
                </div>
                <div class="col-md-8">
                    <h2><strong>Title:</strong> ${movie.title}</h2>
                    <p><strong>Release Date:  </strong>${movie.release_date}</p>
                    <p><strong>Overview: </strong><br/>${movie.overview}</p>
                    <a href="movie.html" class="btn btn-primary" id="backBtn">Back to Search</a>
                </div>  
            
            `;

            $("#singleMovie").html(movieDetails);
            
        })
        .catch(function(error){
            console.log(error);
    });//end axios
}