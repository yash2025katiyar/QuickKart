import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Cart = () => {
  const { cart, fetchCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ line1: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  if (!user) {
    return (
      <div className="empty-state">
        <p>Please log in to view your cart.</p>
        <button className="btn-primary" onClick={() => navigate("/login")}>Log In</button>
      </div>
    );
  }

  const itemsPrice = cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;
  const deliveryFee = itemsPrice >= 199 || itemsPrice === 0 ? 0 : 25;
  const total = itemsPrice + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!address.line1 || !address.city || !address.pincode) {
      alert("Please fill in your delivery address");
      return;
    }
    setPlacing(true);
    try {
      await API.post("/orders", { shippingAddress: address, paymentMethod: "COD" });
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your cart is empty.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-row" key={item.product._id}>
              <img src={item.product.image} alt={item.product.name} />
              <div className="cart-row-info">
                <h4>{item.product.name}</h4>
                <p>{item.product.unit}</p>
                <span className="price">₹{item.product.price}</span>
              </div>
              <div className="stepper">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
              </div>
              <button className="link-danger" onClick={() => removeItem(item.product._id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Delivery Address</h3>
          <input
            placeholder="House no, street"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          />
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />

          <h3>Bill Details</h3>
          <div className="bill-row"><span>Items total</span><span>₹{itemsPrice}</span></div>
          <div className="bill-row"><span>Delivery fee</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
          <div className="bill-row total"><span>To pay</span><span>₹{total}</span></div>

          <button className="btn-primary full" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order..." : "Place Order (Cash on Delivery)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
