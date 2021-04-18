import React, { useEffect, useState } from "react";
import { Col, Row, Pagination } from "react-bootstrap";
import Movie from "../components/Movie";
import { useDispatch, useSelector } from "react-redux";
import { listMovies } from "../actions/movieActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MovieMinimal from "../components/MovieMinimal";
import { Link } from "react-router-dom";
const MovieListScreen = ({ location, history }) => {
  const distpatch = useDispatch();

  const parseParams = (searchParams) => new URLSearchParams(searchParams)
  const parseSearch = (url) => !url ? '#' : new URL(url).search
  const movieList = useSelector((state) => state.movieList);
  const { loading, error, movieResponse: { next, previous, count, results } } = movieList;
  const [currentPage, setCurrentPage] = useState(1)
  let items = [];
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isStaff, setIsStaff] = useState(false);
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage}>
        {number}
      </Pagination.Item>,
    );
  }
  const handlePagination = (search) => {
    if (loading) return;
    history.push(search)
  }
  const paginationBasic = (
    <div>
      <Pagination>
        <Pagination.First disabled={!previous} href={"?page=1"} onClick={(e) => { e.preventDefault(); handlePagination("?page=1") }} />
        <Pagination.Prev disabled={!previous} href={parseSearch(previous)} onClick={(e) => { e.preventDefault(); handlePagination(parseSearch(previous)) }} />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next disabled={!next} href={parseSearch(next)} onClick={(e) => { e.preventDefault(); handlePagination(parseSearch(next)) }} />
        <Pagination.Last disabled={!next} href={`?page=${Math.round(count / 6)}`} onClick={(e) => { e.preventDefault(); handlePagination(`?page=${Math.round(count / 6)}`) }} />
      </Pagination>
    </div>
  );
  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    if (userInfo) {
      setIsStaff(
        userInfo &&
        userInfo.groups !== undefined &&
        (userInfo.groups.includes("Staff") || userInfo.groups.includes("Admins"))
      );
    } else {
      setIsStaff(false);
    }
    distpatch(listMovies(location.search))
    let currentPage = parseParams(location.search).get("page")
    if (currentPage) {
      setCurrentPage(currentPage)
    } else {
      setCurrentPage(1)
    }
    distpatch(listMovies(location.search));

  }, [distpatch, location, userInfo]);

  return (
    <>
      <h1>Movies</h1>
      { paginationBasic}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <Row>
          { results.map((movie) => (

            <Col sm={12} md={isStaff ? 12 : 6} lg={isStaff ? 6 : 4} xl={isStaff ? 6 : 4} key={movie.id}>
              {isStaff ?
                <>
                  <Link to={`/movie/${movie.imdb_id}`}>
                    <MovieMinimal movie={movie}></MovieMinimal>
                  </Link>
                </> : <Movie movie={movie} />}
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MovieListScreen;
