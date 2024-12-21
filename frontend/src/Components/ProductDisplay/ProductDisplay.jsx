import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    console.log("the props received :",props);
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    
   
    // State for tracking the selected size
    const [selectedSize, setSelectedSize] = useState('');

    // Handle size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (selectedSize) {
            addToCart(product.id, selectedSize); // Send product id and selected size
        } else {
            alert('Please select a size first!');
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>

                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>

            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>

                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ${product.old_price}
                    </div>

                    <div className="productdisplay-right-price-new">
                        ${product.new_price}
                    </div>
                </div>

                <div className="productdisplay-right-description">
                    Static description about the t-shirt which is cotton wool and stretchy and beautiful
                </div>

                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <div onClick={() => handleSizeSelect('S')} className={selectedSize === 'S' ? 'selected' : ''}>S</div>
                        <div onClick={() => handleSizeSelect('M')} className={selectedSize === 'M' ? 'selected' : ''}>M</div>
                        <div onClick={() => handleSizeSelect('L')} className={selectedSize === 'L' ? 'selected' : ''}>L</div>
                        <div onClick={() => handleSizeSelect('XL')} className={selectedSize === 'XL' ? 'selected' : ''}>XL</div>
                        <div onClick={() => handleSizeSelect('XXL')} className={selectedSize === 'XXL' ? 'selected' : ''}>XXL</div>
                    </div>
                </div>

                <button onClick={handleAddToCart}>ADD TO CART</button>

                <p className='productdisplay-right-category'>
                    <span>Category:</span> Women, Tshirt, Crop top
                </p>

                <p className='productdisplay-right-category'>
                    <span>Tags:</span> Women, Tshirt, Crop top
                </p>
            </div>
        </div>
    );
};

export default ProductDisplay;
