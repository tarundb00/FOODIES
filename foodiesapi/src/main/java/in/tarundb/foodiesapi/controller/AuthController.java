package in.tarundb.foodiesapi.controller;

import in.tarundb.foodiesapi.io.AuthenticationRequest;
import in.tarundb.foodiesapi.io.AuthenticationResponse;
import in.tarundb.foodiesapi.service.AppUserDetailsService;
import in.tarundb.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        String email = request.getEmail().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        final String jwtToken = jwtUtil.generateToken(userDetails);
        return new AuthenticationResponse(email, jwtToken);

    }
}
