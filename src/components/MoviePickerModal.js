import React, { useState, useEffect, useRef } from "react";
import { DropdownButton, Dropdown, InputGroup, FormControl } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { listMovieDetails, cleanUpMoviesState } from "../actions/movieActions";
import Loader from "./Loader";
import Message from "./Message";
import MovieMinimal from "./MovieMinimal";
import { debounce } from "lodash";

export default function MoviePickerModal(props) {
  const dispatch = useDispatch()
  const movieDetails = useSelector((state) => state.movieDetails);
  const { loading, error, movie } = movieDetails;
  const [searchMethod, setSearchMethod] = useState('URL')
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const debounceSearchTerm = useRef(debounce(nextValue => handleSearch(nextValue), 1000)).current;
  const handleChange = event => {
    const { value: nextValue } = event.target;
    setSearchTerm(nextValue);
    // Even though handleChange is created on each render and executed
    // it references the same debouncedSave that was created initially
    debounceSearchTerm(nextValue);
  };
  const handleSearch = (value) => {
    if (loading) return;
    dispatch(cleanUpMoviesState());

    if (value === '' || value === undefined) {
      handleMethodChange(searchMethod)
      setSearchTerm('')
      return;
    }
    setSearchTerm(value)
    console.log('Searching movie', value)
    if (searchMethod === 'URL') {
      try {
        let imdbUrl = new URL(value.trim().toString())
        if (imdbUrl.origin !== 'https://www.imdb.com' && !imdbUrl.pathname.includes('/title/')) {
          throw 'URL Not from IMBD'
        }
        let imdbId = imdbUrl.pathname.split('/').filter(value => value.startsWith("tt"))
        if (imdbId.length < 1) {
          throw 'URL is missing the ID. Example: https://www.imdb.com/title/<ttXXXXXX>/'
        }
        console.log('MovieID')
        console.log(imdbId)
        setMessage(`Looking for movie with id ${imdbId}`)
        dispatch(listMovieDetails(imdbId));

      } catch (errorException) {
        console.log(errorException)
        if (errorException instanceof TypeError) {
          setMessage('Invalid URL')
        } else if (errorException) {
          setMessage(errorException)
        } else {
          setMessage('Unknown error, try again')
        }
      }
    }
  }

  const handleMethodChange = (newMethod) => {
    setSearchMethod(newMethod)
    setMessage(newMethod == 'URL' ? 'Enter the IMDB Url of the movie you want to search' : 'Type the name of the movie and we will do our best to find it.')
  }
  const moviePicked = (imdb_id) => {
    props.onMoviePicked(imdb_id);
  };



  useEffect(() => {
    if (message === '') {
      handleMethodChange(searchMethod)
    }

    return () => {
      console.log('Cleaning up')
      dispatch(cleanUpMoviesState());
    }
  }, [message, searchMethod, setMessage])

  const handleHide = () => {
    console.log('Hide')
    dispatch(cleanUpMoviesState());
    setSearchMethod('URL')
    handleSearch('')
    props.onHide()
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="movie-search-modal"
      centered
      onHide={handleHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className='w-100' id="movie-search-modal">
          <InputGroup >
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={searchMethod === 'URL' ? 'By IMDB Url' : 'By Name'}
              id="search-method"
            >
              <Dropdown.Item href="#" onSelect={() => handleMethodChange('URL')}>By IMDB Url</Dropdown.Item>
              <Dropdown.Item href="#" onSelect={() => handleMethodChange('NAME')}>By Name</Dropdown.Item>
            </DropdownButton>
            <FormControl className="mt-1 info" aria-describedby="movie-search" value={searchTerm} onChange={handleChange} />
          </InputGroup>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Message>{error ? error : message}</Message>
        {loading ? <Loader></Loader> :
          (!error && movie.info && searchMethod === 'URL') && <MovieMinimal movie={movie} handleClick={(e) => { moviePicked(movie.id); handleHide() }}></MovieMinimal>
        }
        {/* <Button onClick={() => moviePicked("PICKED")}>Close</Button> */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Close</Button>
      </Modal.Footer>
    </Modal >
  );
}
