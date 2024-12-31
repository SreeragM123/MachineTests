import React, { useState, useEffect } from 'react'; 
import { Form, Row, Col, Card, Button, Container } from 'react-bootstrap';  
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import './Film.css';

const Film = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Fetch movies based on search query
  const fetchMovie = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${search}&apikey=a5ef1268`);
      const data = await response.json();
      setMovies(data.Search || []);  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
    
    if (search) {
      fetchMovie(); 
    } else {
      setMovies([]); 
    }
  }, [search]);

  // Handle toggling a movie as a favorite
  const toggleFavorite = (movie) => {
    let updatedFavorites = [...favorites];
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    
    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter(fav => fav.imdbID !== movie.imdbID); // Remove from favorites
    } else {
      updatedFavorites.push(movie); // Add to favorites
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Container>
            <Form className='mb-4'>
              <Form.Group controlId="search">
                <Form.Control
                  className="search-input"
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
              <Link to="/favorites">
                 <Button variant="primary">Favorites</Button>
              </Link>

            </Form>

            <Row>
              {movies.length > 0 ? (
                movies.map((film) => (
                  <Col key={film.imdbID}>
                    <Card>
                      <Card.Img variant="top" src={film.Poster} />
                      <Card.Body>
                        <Card.Title>{film.Title}</Card.Title>
                        <Link to={`/movies/${film.imdbID}`}>
                          <Button variant="primary">View Details</Button>
                        </Link>
                        <Button 
                          variant={favorites.some(fav => fav.imdbID === film.imdbID) ? 'danger' : 'outline-primary'}
                          onClick={() => toggleFavorite(film)}
                        >
                          {favorites.some(fav => fav.imdbID === film.imdbID) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>No movies found. Try searching again!</p>
              )}
            </Row>
          </Container>
        } />

        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/favorites" element={<Favorites favorites={favorites} />} />
      </Routes>
    </Router>
  );
};

// Movie Detail Page
const MovieDetail = () => {
  const { id } = useParams();  
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=a5ef1268`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <Container>
      <Button variant="secondary" onClick={() => navigate('/')}>Back to Search</Button>
      <Card className="movie-detail-card">
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text><strong>Plot:</strong> {movie.Plot}</Card.Text>
          <Card.Text><strong>Genre:</strong> {movie.Genre}</Card.Text>
          <Card.Text><strong>Director:</strong> {movie.Director}</Card.Text>
          <Card.Text><strong>Year:</strong> {movie.Year}</Card.Text>
          <Card.Text><strong>Type:</strong> {movie.Type}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Favorites Page
const Favorites = ({ favorites }) => {
  if (favorites.length === 0) {
    return <div>No favorites added yet!</div>;
  }

  return (
    <Container>
      <h1>Your Favorites</h1>
      <Row>
        {favorites.map((movie) => (
          <Col key={movie.imdbID}>
            <Card>
              <Card.Img variant="top" src={movie.Poster} />
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Link to={`/movies/${movie.imdbID}`}>
                  <Button variant="primary">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Film;
