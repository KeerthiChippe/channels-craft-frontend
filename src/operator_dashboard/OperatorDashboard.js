import React, { useState, useEffect, useMemo } from 'react';
import axios from '../config/axios';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle, CardSubtitle, ListGroup, ListGroupItem } from 'reactstrap';
import { FadeLoader } from 'react-spinners';

const OperatorDashboard = () => {
    const [totalCustomers, setTotalCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [subscriberData, setSubscriberData] = useState({});
    const [totalIncome, setTotalIncome] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await axios.get('/api/listAllCustomers', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setTotalCustomers(customerResponse.data)

                const recentResponse = await axios.get('/api/payment/listLastTenPayments', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setRecentOrders(recentResponse.data)

                const response = await axios.get('/api/payment/subscribersLastThreeMonths', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                const subscribers = response.data;
                const monthCounts = subscribers.reduce((acc, subscriber) => {
                    const paymentMonth = new Date(subscriber.paymentDate).getMonth()
                    const paymentYear = new Date(subscriber.paymentDate).getFullYear()
                    const monthYear = `${paymentMonth + 1}-${paymentYear}`
                    acc[monthYear] = (acc[monthYear] || 0) + 1
                    return acc
                }, {})
                const labels = Object.keys(monthCounts)
                const data = Object.values(monthCounts)
                setSubscriberData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Subscribers',
                            backgroundColor: 'rgba(75,192,192,1)',
                            borderColor: 'rgba(0,0,0,1)',
                            borderWidth: 2,
                            data: data,
                        },
                    ],
                });

                const incomeResponse = await axios.get('/api/payment/listIncomeLastThreeMonths', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setTotalIncome(incomeResponse.data.totalIncome)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching subscriber data:', error)
            }
        }

        fetchData()
    }, [])

    const memoizedTotalCustomers = useMemo(() => totalCustomers.length, [totalCustomers])
    // console.log(memoizedTotalCustomers, 'memoizedTotalCustomers')
    const memoizedTotalIncome = useMemo(() => totalIncome !== null ? totalIncome : 'Loading...', [totalIncome])
    const memoizedSubscriberData = useMemo(() => subscriberData, [subscriberData])
    const memoizedRecentOrders = useMemo(() => recentOrders, [recentOrders])
    // console.log(memoizedRecentOrders, 'memoizedRecentOrders')

    return (
        <div style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
                <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
                    <FadeLoader color="#36D7B7" loading={loading} size={50} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '35%' }}>
                            <div style={{ marginTop: '100px', backgroundColor: 'orange', padding: '30px', borderRadius: '5px' }}>
                                <h3><b>Total Customers - {memoizedTotalCustomers}</b></h3>
                            </div>

                            <div style={{ marginTop: '20px', backgroundColor: 'violet', padding: '30px', borderRadius: '5px' }}>
                                <h3><b>Total Income in Last Three Months - Rs.{memoizedTotalIncome}</b></h3>
                            </div>
                        </div>

                        <div style={{ width: '50%' }}>
                            <h2>Number of Subscribers in the Last Three Months</h2>
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <Bar
                                    data={memoizedSubscriberData}
                                    height={200}
                                    width={400}
                                    options={{
                                        title: {
                                            display: true,
                                            text: 'Number of Subscribers in the Last Three Months',
                                            fontSize: 20,
                                        },
                                        legend: {
                                            display: true,
                                            position: 'top',
                                        },
                                        scales: {
                                            yAxes: [
                                                {
                                                    ticks: {
                                                        beginAtZero: true,
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <h2>Recent orders</h2>
                        {memoizedRecentOrders.length > 0 ? (
                            <div style={{ marginTop: '20px', backgroundColor: 'pink', padding: '30px', borderRadius: '5px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {memoizedRecentOrders.map((order) => (
                                    <div key={order._id} style={{ minWidth: '200px', margin: '0 10px 10px 0' }}>
                                        <Card style={{ width: '100%', height: '100%' }}>
                                            <CardBody>
                                                <CardTitle tag="h5"><b>{order.customerId.customerName}</b></CardTitle><br />
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Packages:</CardSubtitle>
                                                <ListGroup>
                                                    {order.orderId.packages.map((pkg) => (
                                                        <ListGroupItem key={pkg._id}>{pkg.packageId.packageName}</ListGroupItem>
                                                    ))}
                                                </ListGroup><br />
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Channels:</CardSubtitle>
                                                {order.orderId.channels.length > 0 ? (
                                                    <ListGroup>
                                                        {order.orderId.channels.map((chan) => (
                                                            <ListGroupItem key={chan._id}>{chan.channelId.channelName}</ListGroupItem>
                                                        ))}
                                                    </ListGroup>
                                                ) : (
                                                    <p>No channels exist</p>
                                                )}
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No orders yet</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OperatorDashboard;


