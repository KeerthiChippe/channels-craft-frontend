import React, { useState, useEffect } from 'react'
import axios from '../../config/axios'
import { Card, CardBody, CardTitle, CardText } from 'reactstrap'
import { format } from 'date-fns'

const ExpiredOrders = () => {
    const [expiredOrders, setExpiredOrders] = useState([]);

    useEffect(() => {
        const fetchExpiredOrders = async () => {
            try {
                const response = await axios.get('/api/payment/expiredOrders', {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                });
                setExpiredOrders(response.data)
            } catch (error) {
                console.error('Error fetching expired orders:', error)
            }
        };

        fetchExpiredOrders();
    }, []);

    return (
        <div>
            <h2>Expired Orders</h2>

            {expiredOrders.map(order => (
                <Card key={order._id} className="mb-3" style={{ maxWidth: '300px' }}>
                    <CardBody>
                        <CardTitle tag="h5">Date of order: {format(new Date(order.paymentDate), 'yyyy-MM-dd')}</CardTitle>
                        <CardText>Amount: {order.amount}</CardText>
                        <h5>Packages:</h5>
                        <ul>

                            {order.orderId?.packages.map((pkg, index) => (
                                <li key={index}>
                                    <p>{pkg.packageId.packageName}</p>
                                </li>
                            ))}
                        </ul>
                        {/* Uncomment the following block if you want to display channels */}
                        {order.orderId?.channels.length > 0 && (
                            <>
                                <h5>Channels:</h5>
                                <ul>

                                    {order.orderId?.channels.map((chan, i) => (
                                        <li key={i}>
                                            <p>{chan.channelId.channelName}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}


                        {/* <Link to={{ pathname: '/buyagain',  state: { ...orderData, totalPrice: calculatedTotalPrice } }}>
                            <button>Buy Again</button>
                        </Link> */}
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}

export default ExpiredOrders
