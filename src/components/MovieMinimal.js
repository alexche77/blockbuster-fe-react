import React from 'react'
import { Card, Row, Col, Container, Image, Button } from 'react-bootstrap'
import Rating from './Rating'

const MovieMinimal = ({ movie, handleClick }) => {
    const truncate = (input) => input.length > 100 ? `${input.substring(0, 100)}...` : input;

    return (
        <Container>
            <Row>
                <Col md={4}>
                    {movie.info.Poster && <Image src={movie.info.Poster} thumbnail />}
                </Col>
                <Col md={8}>
                    <strong>{movie.info.Title}</strong>
                    {movie.info.Ratings && movie.info.Ratings.map(rating => {
                        return <Rating text={`${rating.Source}: ${rating.Value}`} color="black" key={rating.Source} />
                    })}
                --
                <br></br>
                    {truncate(movie.info.Plot)}
                </Col>
            </Row>
            {handleClick &&
                <Row>
                    <Col><Button className="ml-1" variant="primary" onClick={handleClick}>Select</Button></Col>
                </Row>
            }
        </Container>
    )
}

export default MovieMinimal
