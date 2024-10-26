const Wishlist = require('../models/wishlist');

exports.wishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id; // Get the userId from the authenticated user
  
    try {
      const wishlistItem = await Wishlist.findOne({ userId, productId });
      if (wishlistItem) {
        await Wishlist.deleteOne({ userId, productId });
        res.status(200).json({ isWishlisted: false, message: 'Product removed from wishlist' });
      } else {
        const newWishlistItem = new Wishlist({
          userId,
          productId,
        });
        await newWishlistItem.save();
        res.status(201).json({ isWishlisted: true, message: 'Product added to wishlist' });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      res.status(400).json({ message: 'Error toggling wishlist' });
    }
  };

exports.checkWishlistStatus = async (req, res) => {

const productId = req.params.id;

const userId = req.user.id;


try {

    const wishlistItem = await Wishlist.findOne({ userId, productId });

    res.json({ isWishlisted:!!wishlistItem });

} catch (error) {

    console.error('Error checking wishlist status:', error);

    res.status(400).json({ message: 'Error checking wishlist status' });

}

};

// Fetch Products from Wishlist
exports.fetchwishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        if(!userId){
            return res.status(400).json({ message: 'User Not Found'});
        }
        else{
        const wishlist = await Wishlist.find({ userId }).populate('productId');
        
        // Extract products from the wishlist
        const products = wishlist.map(item => item.productId);

        res.json(products);
        }
    } catch (error) {
      console.error(error);
      console.log(userId);
      res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
  };