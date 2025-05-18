// import { useLocation } from "react-router-dom"
// import { useSelector } from "react-redux"
// import axios from "../../config/axios"
// import './orderDetails.css'

// const OrderDetails = () => {
//     const location = useLocation()

//     const cart = useSelector((state) => {
//         return state.order
//     })
//     // console.log(cart, 'cart items')

//     // console.log(location.state[0], "location")

//     const handlePay = async () => {
//         const amount = location.state[0].totalPrice
//         const orderId = location.state[0]._id
//         try {
//             const { data } = await axios.post('/api/payment', { amount, orderId }, {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 }
//             })
//             localStorage.setItem('stripId', data.id)
//             window.location = data.url
//         } catch (e) {
//             console.log(e)
//         }

//     }

//     return (
//         <div className="container">
//             <div className="order-details-container">
//                 <div className="order-details">
//                     <h1 className="text-center"> Order Details</h1>

//                     <h3>Packages</h3>
//                     <p>No.of packages-{cart.packages.length}</p>
//                     <ul className="list-group">
//                         {cart.packages.map((item, index) => (

//                             <li key={index} className="list-group-item">
//                                 <div>
//                                     Name of the package- {item.packageName}<br />
//                                     Price- {item.packagePrice} <br />
//                                 </div>

//                             </li>
//                         ))}
//                     </ul>

//                     <h3>Channels</h3>
//                     <p>No.of Channels-{cart.channels.length}</p>
//                     <ul className="list-group">
//                         {cart.channels.map((item, index) => (
//                             <li key={index} className="list-group-item">
//                                 <div>
//                                     Name of the channel- {item.channelName} <br />
//                                     Price- {item.channelPrice}
//                                 </div>

//                             </li>
//                         ))}
//                     </ul>

//                     <h3>Total Price - {location.state && location.state[0]?.totalPrice}</h3>
//                     <button onClick={handlePay}>pay</button>
//                 </div>
//             </div>
//         </div>

//     )
// }
// export default OrderDetails
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../config/axios";
import './orderDetails.css';

// React Icons
import { FaBox, FaTv, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

const OrderDetails = () => {
  const location = useLocation();
  const cart = useSelector((state) => state.order);

  const handlePay = async () => {
    const amount = location.state[0].totalPrice;
    const orderId = location.state[0]._id;
    try {
      const { data } = await axios.post(
        "/api/payment",
        { amount, orderId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      localStorage.setItem("stripId", data.id);
      window.location = data.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="order-page">
      <div className="order-card">
        <h1 className="title">🧾 Order Details</h1>

        {/* Packages */}
        <div className="section">
          <h2 className="section-title">
            <FaBox className="icon" /> Packages
          </h2>
          <p>🎁 Total Packages: <strong>{cart.packages.length}</strong></p>
          <ul className="item-list">
            {cart.packages.map((item, index) => (
              <li key={index} className="item">
                📦 <strong>{item.packageName}</strong> — ₹{item.packagePrice}
              </li>
            ))}
          </ul>
        </div>

        {/* Channels */}
        <div className="section">
          <h2 className="section-title">
            <FaTv className="icon" /> Channels
          </h2>
          <p>📺 Total Channels: <strong>{cart.channels.length}</strong></p>
          <ul className="item-list">
            {cart.channels.map((item, index) => (
              <li key={index} className="item">
                📡 <strong>{item.channelName}</strong> — ₹{item.channelPrice}
              </li>
            ))}
          </ul>
        </div>

        {/* Total Price */}
        <div className="total">
          <FaMoneyBillWave className="icon" />
          <h2>
            Total: ₹{location.state && location.state[0]?.totalPrice}
          </h2>
        </div>

        {/* Pay Button */}
        <button className="pay-button" onClick={handlePay}>
          <FaCreditCard className="icon" />
          Pay Now 💳
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
