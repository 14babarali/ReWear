export const createProduct = async (product) => {
    e.preventDefault();

    // Basic form validation
    if (!product.name || !product.type || !product.material || !product.category || !product.size || !product.description || !product.price || !product.qty || !product.condition) {
        toast.error('Please fill in all required fields.');
        return;
    }

    if(!product.id){

        if (!product.images[0]){
            toast.error('Please add atleast 1 picture for products.');
            return;
        }

    }

    // Ensure numeric validation for price, qty, and condition
    if (isNaN(product.price) || isNaN(product.qty) || isNaN(product.condition)) {
        toast.error(t('numericValues'));
        return;
    }
    
    // Ensure non-numeric validation for name, type, material, category, size, and description
    const containsNumberRegex = /\d/;
    // const containsInvalidCharsRegex = /[^a-zA-Z\s\d.!"#$%&'()*+,-:;<=>?@[\\\]^_`{|}~]/;
    const containsInvalidCharsRegex = /[^a-zA-Z0-9\s]/;

    if (containsNumberRegex.test(product.name) || containsInvalidCharsRegex.test(product.name)) {
        toast.warning('Please use alphabets in "Name" only.');
        return;
    }
    
    if (containsNumberRegex.test(product.material) || containsInvalidCharsRegex.test(product.material)) {
        toast.warning(t('alphabeticOnly', { fieldName: 'Name' }));
        return;
    }
    
    if (product.description.length > 160) {
        toast.warning(t('descriptionLimit'));
        return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('type', product.type);
    formData.append('material', product.material);
    formData.append('category', product.category);
    formData.append('size', product.size);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('qty', product.qty);
    formData.append('condition', product.condition);

    product.images.forEach((image, index) => {
        formData.append('images', image);
    });

    try {
        const token = localStorage.getItem('token');
        let response;

        if (product.id) {
            // If the product has an id, we're editing an existing product
            response = await axios.put(`http://localhost:3001/api/editproduct/${product.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            // Otherwise, we're adding a new product
            response = await axios.post('http://localhost:3001/api/uploadproduct', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        if (response.status === 200 || response.status === 201) {
            const newProduct = response.data;
            if (product.id) {
                // Update the product list with the edited product
                setProductList(productList.map(p => p._id === newProduct._id ? newProduct : p));
                toast.success('Product edited successfully!');
            } else {
                // Add the new product to the product list
                setProductList([...productList, newProduct]);
                toast.success('Product added successfully!');
            }

            setProduct({
                id: '',
                name: '',
                type: '',
                material: '',
                category: '',
                size: '',
                description: '',
                price: '',
                qty: '',
                condition: '',
                images: []
            }); // Reset the form
            setPreviews([]); // Clear the previews
            setShow(false); // Close the modal
        } else {
            console.error('Failed to save product');
            toast.error('Failed to save product');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while saving the product.');
    }
};

export const handleDelete = async (id) => {

    try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3001/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setProductList(productList.filter(product => product._id !== id));
                toast.success('Product deleted successfully!');
            } else {
                console.error('Failed to delete product');
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while deleting the product.');
        }finally {
            hideDeleteConfirmation(); // Close the confirmation modal regardless of the outcome
        }
};

export const fetchProducts = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/fetchproducts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return(response.data);
        } else {
            console.error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};