import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Movie = ({ movie }) => {
    return (
        <Card className="my-3 p-3 rounded">

            <Link to={`/movie/${movie.imdb_id}`}>
                <Card.Img src={movie.info.Poster} variant='top' />
            </Link>
            <Card.Body>
                <Link to={`/movie/${movie.imdb_id}`}>
                    <Card.Title as='div'>
                        <strong>{movie.info.Title}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    {movie.info.Ratings && movie.info.Ratings.map(rating => {
                        return <Rating text={`${rating.Source}: ${rating.Value}`} color="black" key={rating.Source} />
                    })}

                </Card.Text>

                <Card.Text as='p'>
                    {movie.info.Genre}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Movie
