import { useEffect, useState } from "react";
import API from "../api/axios";

const STATUS_LABELS = {
  placed: "Order Placed",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders");
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading your orders…</p>;
  if (orders.length === 0) return <p className="loading-text">You haven't placed any orders yet.</p>;

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-header">
            <span>Order #{order._id.slice(-6).toUpperCase()}</span>
            <span className={`status-badge status-${order.status}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <ul className="order-item-list">
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} × {item.quantity}</li>
            ))}
          </ul>
          <div className="order-card-footer">
            <span>{new Date(order.createdAt).toLocaleString()}</span>
            <strong>₹{order.totalPrice}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
