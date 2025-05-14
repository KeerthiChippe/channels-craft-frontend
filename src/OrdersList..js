import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { startGetAllOrders } from "./actions/order-action"
import { useDispatch } from "react-redux"

const OrdersList = ()=>{
    const dispatch = useDispatch()
    const orders = useSelector((state)=>{
        return state.order
    })
    console.log(orders, "all orders")

    useEffect(()=>{
        dispatch(startGetAllOrders())
    }, [dispatch])

    return(
        <div>
            <h2>List of orders</h2>
            
            <ul>
                
                {orders.paid?.map((ele)=>{
                    return <li key={ele._id}>
                        <p>Customer - {ele.customerId?.customerName}</p>
                        <p>Date of order - {ele.orderDate}</p>
                        <p>Packages:</p>
            <ul>
              {ele.packages?.map((pack) => (
                
                <li key={pack._id}>{pack.packageId?.packageName}</li>
                
              ))}
            </ul>
            <p>Channels:</p>
            <ul>
              {ele.channels?.map((channel) => (
                <li key={channel._id}>{channel.channelId?.channelName}</li>
              ))}
            </ul>

            <p>Total Price - {ele.totalPrice}</p>
                    </li>
                })}
                
            </ul>
            
        </div>
    )
}
export default OrdersList