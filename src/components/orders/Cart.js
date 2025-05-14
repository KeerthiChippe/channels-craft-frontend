import { useSelector, useDispatch } from "react-redux";
import { startCreateOrder } from "../../actions/order-action";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './cart.css'

const Cart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => {
        return state
    })

    // console.log(cart.order.packages, "cart packages")
    // console.log(cart.order.channels, 'cart channels')
    // console.log(cart.order.packages.length + cart.order.channels.length, 'cart total')
    const cartTotal = cart.order.packages.length + cart.order.channels.length

    const { packages: pack, channels } = useSelector((state) => {
        return state.order || {};
    });

    const calculateTotalPriceForPackages = () => {
        return pack.reduce((total, item) => total + item.packagePrice, 0);
    };

    const calculateTotalPriceForChannels = () => {
        return channels.reduce((total, item) => total + item.channelPrice, 0);
    };

    const calculateTotalPriceForBoth = () => {
        return calculateTotalPriceForPackages() + calculateTotalPriceForChannels();
    };

    const handleOrder = () => {
        const formData = {
            packages: pack,
            channels: channels,
            // orderDate: new Date(),
        };
        dispatch(startCreateOrder(formData));
    };

    useEffect(() => {
        if (cart.order.cart.length > 0) {
            // const price = calculateTotalPriceForPackages()
            navigate('/orderpay', { state: cart.order.cart })
            // console.log(cart.order.cart, "cart")
        }
    }, [cart.order.cart])

    return (
        <div className="cart" style={{ marginLeft: "3px", height: "50%" }} >
            <Row >
                <Col md={6}  >
                    <Row >
                        <Col>
                            <h2>No. of Cart items- {cartTotal}</h2>
                        </Col>
                    </Row>

                    <Row >
                        <Col>
                            {cart.order?.packages?.length > 0 && (
                                <>
                                    <h3>Packages</h3>
                                    <ListGroup>
                                        {cart.order.packages.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <b>{item.packageName}</b> - {item.packagePrice}
                                                <ul>
                                                    {item.selectedChannels.map((channel, i) => {
                                                        return <li key={i}>{channel.channelName}</li>
                                                    })}
                                                </ul>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}


                            {cart.order?.channels.length > 0 && (
                                <>
                                    <h3>Channels</h3>
                                    <ListGroup>
                                        {cart.order.channels.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                {item.channelName} - {item.channelPrice}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}

                        </Col>
                    </Row>

                    <Row >
                        <Col>
                            <h3>Total Price for Packages: {calculateTotalPriceForPackages()}</h3>
                            <h3>Total Price for Channels: {calculateTotalPriceForChannels()}</h3>
                            <h3>Total Price for Both: {calculateTotalPriceForBoth()}</h3>
                        </Col>
                    </Row>

                    <Row >
                        <Col>
                            <Button variant="success" onClick={handleOrder}>
                                Order
                            </Button>
                        </Col>
                    </Row>

                </Col>

                <Col md={6}>
                    <img src='./camera.jpg' alt='image' height='600vh' margin="auto" width="102.5%" />
                </Col>
            </Row>


        </div>
    )
}

export default Cart
