/**
 * Composable for product-related operations
 */

export interface Product {
  id: string | number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  tag?: 'new' | 'best-sale' | 'out-of-stock';
  tagLabel?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  addedAt: Date;
}

export const useProduct = () => {
  const toast = useToast();

  /**
   * Add product to cart
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    // TODO: Implement cart logic with API
    const cartItems = useState<CartItem[]>('cart-items', () => []);

    const existingItem = cartItems.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        ...product,
        quantity,
      });
    }

    toast.add({
      title: 'Added to Cart',
      description: `${product.title} has been added to your cart`,
      color: 'green',
    });
  };

  /**
   * Remove product from cart
   */
  const removeFromCart = (productId: string | number) => {
    const cartItems = useState<CartItem[]>('cart-items', () => []);
    const index = cartItems.value.findIndex((item) => item.id === productId);

    if (index > -1) {
      cartItems.value.splice(index, 1);
      toast.add({
        title: 'Removed from Cart',
        description: 'Item has been removed from your cart',
        color: 'gray',
      });
    }
  };

  /**
   * Update cart item quantity
   */
  const updateCartQuantity = (productId: string | number, quantity: number) => {
    const cartItems = useState<CartItem[]>('cart-items', () => []);
    const item = cartItems.value.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  /**
   * Get cart items
   */
  const getCartItems = () => {
    return useState<CartItem[]>('cart-items', () => []);
  };

  /**
   * Get cart total
   */
  const getCartTotal = () => {
    const cartItems = getCartItems().value;
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0,
    );
  };

  /**
   * Get cart count
   */
  const getCartCount = () => {
    const cartItems = getCartItems().value;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Add product to wishlist
   */
  const addToWishlist = (product: Product) => {
    const wishlistItems = useState<WishlistItem[]>('wishlist-items', () => []);

    const exists = wishlistItems.value.some((item) => item.id === product.id);

    if (!exists) {
      wishlistItems.value.push({
        ...product,
        addedAt: new Date(),
      });

      toast.add({
        title: 'Added to Wishlist',
        description: `${product.title} has been added to your wishlist`,
        color: 'green',
      });
    } else {
      toast.add({
        title: 'Already in Wishlist',
        description: `${product.title} is already in your wishlist`,
        color: 'amber',
      });
    }
  };

  /**
   * Remove product from wishlist
   */
  const removeFromWishlist = (productId: string | number) => {
    const wishlistItems = useState<WishlistItem[]>('wishlist-items', () => []);
    const index = wishlistItems.value.findIndex(
      (item) => item.id === productId,
    );

    if (index > -1) {
      wishlistItems.value.splice(index, 1);
      toast.add({
        title: 'Removed from Wishlist',
        description: 'Item has been removed from your wishlist',
        color: 'gray',
      });
    }
  };

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = (productId: string | number) => {
    const wishlistItems = useState<WishlistItem[]>('wishlist-items', () => []);
    return wishlistItems.value.some((item) => item.id === productId);
  };

  /**
   * Get wishlist items
   */
  const getWishlistItems = () => {
    return useState<WishlistItem[]>('wishlist-items', () => []);
  };

  /**
   * Clear cart
   */
  const clearCart = () => {
    const cartItems = useState<CartItem[]>('cart-items', () => []);
    cartItems.value = [];
  };

  /**
   * Clear wishlist
   */
  const clearWishlist = () => {
    const wishlistItems = useState<WishlistItem[]>('wishlist-items', () => []);
    wishlistItems.value = [];
  };

  return {
    // Cart operations
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartItems,
    getCartTotal,
    getCartCount,
    clearCart,

    // Wishlist operations
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItems,
    clearWishlist,
  };
};
