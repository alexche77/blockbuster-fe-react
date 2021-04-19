import React, { useState, useEffect } from "react";
import { Button, Pagination } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../actions/orderActions";
import { createOrder } from "../services/orderService";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Order from "../components/Order";

const OrdersListScreen = ({ history, location }) => {
  const distpatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const parseParams = (searchParams) => new URLSearchParams(searchParams)
  const parseSearch = (url) => !url ? '#' : new URL(url).search
  const [addingNew, setAddingNew] = useState(false);
  const { loading, error, ordersResponse :{ next, previous, count, results }} = orderList;
  const [currentPage, setCurrentPage] = useState(1)
  const handlePagination = (search) => {
    if (loading) return;
    if(!search) {
      history.push('/orders')
    }else{
      
      history.push(search)
    }
  }
  const addNew = () => {
    setAddingNew(true);
    createOrder()
      .then(({ data }) => {
        if (data.id) {
          history.push(`/order/${data.id}`);
        } else {
          throw new Error("Failed to create");
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setAddingNew(true));
  };

  // useEffect: This runs as soon as the component loads
  useEffect(() => {
    
    let currentPage = parseParams(location.search).get("page")
    if (currentPage) {
      setCurrentPage(currentPage)
    } else {
      setCurrentPage(1)
    }
    distpatch(listOrders(location.search));
  }, [distpatch,  location]);

  const paginationBasic = (
    <div>
      <Pagination>
        <Pagination.First disabled={!previous} href={"?page=1"} onClick={(e) => { e.preventDefault(); handlePagination("?page=1") }} />
        <Pagination.Prev disabled={!previous} onClick={(e) => { e.preventDefault(); handlePagination(parseSearch(previous)) }} />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next disabled={!next} onClick={(e) => { e.preventDefault(); handlePagination(parseSearch(next)) }} />
        <Pagination.Last disabled={!next} href={`?page=${Math.round(count / 6) + (((count%6 > 0) ?1:0))}`} onClick={(e) => { e.preventDefault(); handlePagination(`?page=${Math.round(count / 6) + (((count%6 > 0) ?1:0))}`) }} />
      </Pagination>
    </div>
  );

  return (
    <>
      <h1>Orders</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <>
          <Row>
            <Button disabled={addingNew} onClick={addNew}>
              {addingNew ? "Loading.." : "Add new"}
            </Button>
          </Row>
          <Row className="py-4">
            {paginationBasic}
          </Row>
          <Row>
            {results.map((order) => (
              <Col sm={12} md={4} lg={4} xl={4} key={order.id}>
                <Order order={order}></Order>
              </Col>
            ))}
          </Row></>
      )}
    </>
  );
};

export default OrdersListScreen;
