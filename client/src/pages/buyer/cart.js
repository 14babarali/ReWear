import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cart.css';
import HorizontalCard from '../../components/cartcard';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate  } from 'react-router-dom';
//buyer
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch cart items from backend
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/cartitems', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const data = response.data;
            if (Array.isArray(data.products)) {
              setCartItems(data.products);
            } else {
              // Handle unexpected response format
              console.error('Unexpected data format:', data);
              setCartItems([]);
            }
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItems([]);
        }
      };

    fetchCartItems();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = { ...prevSelectedItems };
      if (newSelectedItems[id]) {
        delete newSelectedItems[id];
      } else {
        newSelectedItems[id] = true;
      }
      return newSelectedItems;
    });
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    try{
      const response = await axios.delete(`http://localhost:3001/api/deletecartitem/${productId}`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        toast.success('Product removed from cart.');
      }
      else {
        toast.error('Failed to remove product.');
      }

    }catch(error){
      console.error('Error deleting product:', error);
      toast.error('Failed to remove product.');
    }
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      // Update quantity in the local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
  
      // Make API request to update the cart on the backend
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/api/qtyupdated', {
        productId,
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        // toast.success('Cart updated successfully.');
      } else if (response.status === 300) {
        toast.warning(response.data.message || 'Quantity exceeds available stock');
      } else {
        toast.warning('Failed to update cart.');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart.');
    }
  };
  

  // Calculate subtotal and total
  const calculateSubtotal = () => {
    return Object.keys(selectedItems).reduce((subtotal, id) => {
      const item = cartItems.find(item => item.id === id);
      return subtotal + (item.price * item.quantity); // Assume item has a price field
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleProceedToCheckout = async () => {

    // Collect selected item IDs
    const selectedItemIds = Object.keys(selectedItems);

    if (selectedItemIds.length === 0) {
      toast.warning('Please select at least one product to proceed to checkout.');
      return;
    }

    try {

        // localStorage.setItem('selectedProducts',JSON.stringify([]));
        localStorage.removeItem('selectedProducts');
    

        // Fetch product details for selected items
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/cartproducts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: selectedItemIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
        });

        if (response.status === 200) {
            const products = response.data;
            // Process the products data as needed
            // console.log('Products:', products);

            // Save selected items and product details to localStorage
            localStorage.setItem('selectedProducts', JSON.stringify(products));
            navigate('/buyer/checkout'); // Navigate to checkout page
        } else {
            toast.warning('Failed to fetch product details.');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Error Fetching Product Details.');
    }
};


  return (
    <div className='vh-95'>
      <ToastContainer/>
      <div style={{marginTop: '10px', textAlign:'center'}}> 
        <h1>Your Cart</h1>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p style={{textAlign:'center', marginTop:'200px'}}>Your cart is empty.</p>
        ) : (
          <ul>
              {cartItems.map(item => (
            <div key={item.id} className='cart-item'>
              <input
                  type="checkbox"
                  checked={!!selectedItems[item.id]}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              <HorizontalCard product={item} onQuantityChange={handleQuantityChange} onDelete={handleDelete} />
            </div>
            ))}
          </ul>
        )}
        <div className="cart-summary">
          <h4>Summary</h4>
          <p>Subtotal: <span>PKR {calculateSubtotal().toFixed(2)}</span></p>
          <p>Total: <span>PKR {calculateTotal().toFixed(2)}</span></p>
          <Link
            className="bg-black text-white no-underline py-2 px-4 rounded mt-4"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Cart;
