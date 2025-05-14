import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useLocation } from "react-router-dom";
import './orderDetails.css';

const BuyAgain = () => {
    const [paymentDetails, setPaymentDetails] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const amount = location.state.totalPrice
            try {
                const orderId = location.state._id;
                const response = await axios.get(`/api/orders/${orderId}`, {amount, orderId}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data, "buy again")
                setPaymentDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [location.state]);

    return (
        <div className="container">
            <div className="order-details-container">
                <div className="order-details">
                    <h1 className="text-center"> Order Details</h1>

                    <h3>Packages</h3>
                    <ul className="list-group">
                        {paymentDetails?.packages.map((item, index) => (
                            <li key={index} className="list-group-item">
                                <div>
                                    Name of the package: {item.packageName}<br />
                                    Price: {item.packagePrice} <br />
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3>Channels</h3>
                    <ul className="list-group">
                        {paymentDetails?.channels.map((item, index) => (
                            <li key={index} className="list-group-item">
                                <div>
                                    Name of the channel: {item.channelName} <br />
                                    Price: {item.channelPrice}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3>Total Price - {paymentDetails?.totalPrice}</h3>
                </div>
            </div>
        </div>
    );
};

export default BuyAgain;
