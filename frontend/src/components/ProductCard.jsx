import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartItem = cart.items?.find((i) => i.product?._id === product._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart(product._id, 1);
  };

  const handleChange = async (delta) => {
    const newQty = (cartItem?.quantity || 0) + delta;
    await updateQuantity(product._id, newQty);
  };

  return (
    <div className="product-card">
      <div className="product-media">
        <span className="delivery-clock">⏱ {product.deliveryTimeMins} MINS</span>
        {product.discountPercent > 0 && (
          <span className="discount-tag">{product.discountPercent}% OFF</span>
        )}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-body">
        <p className="product-unit">{product.unit}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-footer">
          <div className="price-block">
            <span className="price">₹{product.price}</span>
            {product.mrp > product.price && <span className="mrp">₹{product.mrp}</span>}
          </div>

          {cartItem ? (
            <div className="stepper">
              <button onClick={() => handleChange(-1)} aria-label="Decrease quantity">−</button>
              <span>{cartItem.quantity}</span>
              <button onClick={() => handleChange(1)} aria-label="Increase quantity">+</button>
            </div>
          ) : (
            <button className="btn-add" onClick={handleAdd}>ADD</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
