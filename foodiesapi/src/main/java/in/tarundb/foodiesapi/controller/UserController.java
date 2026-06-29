package in.tarundb.foodiesapi.controller;

import in.tarundb.foodiesapi.io.UserRequest;
import in.tarundb.foodiesapi.io.UserResponse;
import in.tarundb.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
       return userService.registerUser(request);

    }
}
