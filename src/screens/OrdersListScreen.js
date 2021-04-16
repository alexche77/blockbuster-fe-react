import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Table from 'react-bootstrap/Table'
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrdersListScreen = ({history}) => {
    const distpatch = useDispatch();
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const goToAddNew = () => history.push('/order/new')
    // useEffect: This runs as soon as the component loads
    useEffect(() => {
        distpatch(listOrders());
    }, [distpatch]);

    return (
        <>
            <h1>Orders</h1>
            <Button onClick={goToAddNew}>Add new</Button>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger"> {error}</Message>
            ) : (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default OrdersListScreen;
