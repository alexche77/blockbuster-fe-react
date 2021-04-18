import React from 'react'
import { Card, Form, Col } from 'react-bootstrap'
import MovieMinimal from "../components/MovieMinimal";
export default function Movement({movement}) {
    return (
        <Card className="my-3 p-3 rounded">
            <Card.Body>
                <MovieMinimal movie={movement.movie} />
                <Form.Row className="my-3">
                    <Form.Group as={Col} controlId="formMovementQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control defaultValue={movement.quantity} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formMovementPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control defaultValue={movement.price} />
                    </Form.Group>
                </Form.Row>
            </Card.Body>
        </Card>
    )
}
