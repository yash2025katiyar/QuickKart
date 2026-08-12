import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Breakfast",
        "Snacks",
        "Beverages",
        "Personal Care",
        "Household",
        "Bakery",
      ],
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 100 },
    deliveryTimeMins: { type: Number, default: 10 },
    rating: { type: Number, default: 4.2 },
  },
  { timestamps: true }
);

productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
