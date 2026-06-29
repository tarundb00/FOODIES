package in.tarundb.foodiesapi.service;

import in.tarundb.foodiesapi.io.CartRequest;
import in.tarundb.foodiesapi.io.CartResponse;

public interface CartService {

   CartResponse addToCart(CartRequest request);

   CartResponse getCart();

   void clearCart();

  CartResponse removeFromCart(CartRequest cartRequest);
}
