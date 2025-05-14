import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Bar } from 'react-chartjs-2';

const UsersDashboard = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/operator-customers', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data, "dashboard")
                if (Array.isArray(response.data)) {
                    const operatorData = response.data.map(item => ({
                        operatorName: item.operatorName[0],
                        customerCount: item.customerCount
                        
                }))
                console.log(operatorData, "hjkkl")
            
                const labels = operatorData.map(items => items.operatorName);
                console.log(labels, 'labels')
                const counts = operatorData.map(items => items.customerCount);
                console.log(counts, "counts")
                setData({
                    labels: labels,
                    datasets: [{
                        label: 'Customer Count',
                        data: counts,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                });
            }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Operator Customer Count</h2>
            <div style={{ height: '400px', width: '600px' }}>
                
            {data.labels && data.datasets && (
                    <Bar data={data} />
                )}

            </div>
        </div>
    );
};

export default UsersDashboard;
