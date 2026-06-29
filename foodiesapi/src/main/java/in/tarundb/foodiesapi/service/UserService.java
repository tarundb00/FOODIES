package in.tarundb.foodiesapi.service;

import in.tarundb.foodiesapi.io.UserRequest;
import in.tarundb.foodiesapi.io.UserResponse;

public interface UserService {

   UserResponse registerUser(UserRequest request);

   String findByUserId();
}
