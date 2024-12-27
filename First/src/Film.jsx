import React, { useState, useEffect } from 'react'; 
import { Form, Row, Col, Card, Button } from 'react-bootstrap';  

const Film = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const fetchMovie = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${search}&apikey=your_api_key`);
      const data = await response.json();
      setMovies(data.Search || []);  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (search) {
      fetchMovie(); 
    } else {
      setMovies([]); 
    }
  }, [search]);  

  return (
    <div>
      <Form >
        <h1>Search Movies</h1>
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}  
          />
        </Form.Group>
      </Form>
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie.imdbID}>
              <Card>
                <Card.Img variant="top" src={movie.Poster} />
                <Card.Body>
                  <Card.Title>{movie.Title}</Card.Title>
                  <Card.Text>{movie.Year || 'No Description Available'} - {movie.Type}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No movies found. Try searching again!</p>  
        )}
      </Row>
    </div>
  );
};

export default Film;
