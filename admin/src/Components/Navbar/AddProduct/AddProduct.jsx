import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../../assets/upload_area.svg'

const AddProduct = () => {

const [image,setImage] = useState(false);
const [productDetails , setproductDetails] = useState(
  {
    name : "",
    image : "",
    category : "women",
    new_price: "",
    old_price : ""

  }
)

const imageHandler = (e) => {
  setImage(e.target.files[0]);

}

const changeHandler = (e) => {
  setproductDetails({...productDetails,[e.target.name]:e.target.value})
}

const Add_Product = async () => {
  console.log("Product details before upload:", productDetails);

  if (!image) {
    console.error('No image selected');
    return;
  }

  let formData = new FormData();
  formData.append('product', image);

  try {
    // Step 1: Upload the image
    const uploadResponse = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    console.log("Image upload response:", uploadData);

    if (!uploadData.success) {
      console.error('Image upload failed:', uploadData.message);
      return;
    }

    // Step 2: Update product details with the uploaded image URL
    const updatedProductDetails = {
      ...productDetails,
      image: uploadData.image_url, // Add the uploaded image URL
    };

    console.log("Product details after image upload:", updatedProductDetails);

    // Step 3: Send the product details to the backend
    const addProductResponse = await fetch('http://localhost:4000/addproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProductDetails),
    });

    const addProductData = await addProductResponse.json();
    if (addProductData.success) {
      alert("Product Added");
    } else {
      alert("Failed to add product");
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



  return (
    
    <div className='add-product'>
  
      <div className="addproduct-itemfield">
        <p>Poduct Title</p>
        <input value={productDetails.name}onChange={changeHandler} type='text' name='name' placeholder='Type here'/>
      </div>


      <div className="addproduct-price">
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetails.old_price}onChange={changeHandler}type='text' name='old_price' placeholder='Type Here'/>
        </div>


        <div className="addproduct-itemfield">
            <p> Offer Price</p>
            <input value={productDetails.new_price}onChange={changeHandler}type='text' name='new_price' placeholder='Type Here'/>
        </div>
      </div>


      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>

        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor='file-input'>
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct
