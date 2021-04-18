import React, { useState } from 'react'
import { Card, Form, Col, Button } from 'react-bootstrap'
import { updateMovement, deleteMovement } from '../services/movementService';
import MovieMinimal from "../components/MovieMinimal";
import { useDispatch } from 'react-redux';
import { listMovements } from '../actions/movementsActions';
export default function Movement({ movement }) {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(movement.quantity)
    const [price, setPrice] = useState(movement.price)
    const [unitPrice, setUnitPrice] = useState(movement.unit_price)
    const [updatePending, setUpdatePending] = useState(false)
    const validateNumber = (value, isFloating) => {
        if (!value || value === '') {

            return isFloating ? 0.1 : 1;
        }
        let numVal = +value
        if (isFloating) {
            numVal = parseFloat(value)
        }
        if (numVal <= 0) {

            return isFloating ? 0.1 : 1;
        }
        return numVal;
    }
    const handleQuantity = ({ target: { value } }) => {
        setQuantity(validateNumber(value))
        setUpdatePending(true)
    }

    const handlePrice = ({ target: { value } }) => {
        setPrice(validateNumber(value, true))
        setUpdatePending(true)
    }

    const handleDelete = () => {
        deleteMovement(movement.id).then(() => {
            // Delete from app state movement list

            console.log('Deleted!')
            dispatch(listMovements(movement.order.id))
        }).catch((error) => {
            console.error(error)
        })
    }

    const handleUpdate = () => {
        console.log(`Updating movement # ${movement.id} --> Price ${price} / Quantity ${quantity}}`)
        updateMovement(movement.id, { price: price, quantity: quantity, unit_price: (price / quantity).toFixed(2) })
            .then(({ data }) => {
                setPrice(parseFloat(data.price))
                setQuantity(data.quantity)
                setUnitPrice(data.unit_price)
                setUpdatePending(false)
            }).catch((error) => {
                console.error(error)
            })
    }

    return (
        <Card className="my-3 p-3 rounded">
            <Card.Body>
                <MovieMinimal movie={movement.movie} />
                <Form.Row className="my-3">
                    <Form.Group as={Col} controlId="formMovementQuantity">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control disabled={movement.order.order_state !== 0} type="number" min="1" step="1" value={quantity} onChange={handleQuantity} aria-describedby="unitPriceHelpBlock" />
                        <Form.Text id="unitPriceHelpBlock" muted>
                            Unit price: {unitPrice}
                            <br></br>
                            Profit margin: {movement.movie.profit_percentage} %
                            <br></br>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formMovementPrice">
                        <Form.Label>Total price</Form.Label>
                        <Form.Control disabled={movement.order.order_state !== 0} type="number" min="0" step="0.1" value={price} onChange={handlePrice} aria-describedby="priceHelpBlock" />
                        <Form.Text id="priceHelpBlock" muted>
                            The total amount of money paid for the batch of {quantity}
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <Button className="w-100" variant='dark' disabled={!updatePending || movement.order.order_state !== 0} onClick={handleUpdate}>Save</Button>
                <Button className="w-100" variant='danger' onClick={handleDelete} disabled={movement.order.order_state !== 0}>Delete</Button>
            </Card.Body>
        </Card>
    )
}
