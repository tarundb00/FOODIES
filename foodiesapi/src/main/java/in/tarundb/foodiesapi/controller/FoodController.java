package in.tarundb.foodiesapi.controller;

import in.tarundb.foodiesapi.io.FoodRequest;
import in.tarundb.foodiesapi.io.FoodResponse;
import in.tarundb.foodiesapi.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FoodController {

    private final FoodService foodService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FoodResponse> addFood(
            @RequestPart("food") String foodString,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        FoodRequest request;

        try {
            request = objectMapper.readValue(foodString, FoodRequest.class);
        } catch (JsonProcessingException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        FoodResponse response = foodService.addFood(request, file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FoodResponse> addFoodJson(@RequestBody FoodRequest request) {
        FoodResponse response = foodService.addFood(request, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readfoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id) {
        return foodService.readFood(id);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);

    }

    @PostMapping
    public ResponseEntity<FoodResponse> addFoodFallback(
            @RequestBody(required = false) FoodRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        FoodResponse response = foodService.addFood(request, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// package in.tarundb.foodiesapi.controller;
//
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import in.tarundb.foodiesapi.io.FoodRequest;
// import in.tarundb.foodiesapi.io.FoodResponse;
// import in.tarundb.foodiesapi.service.FoodService;
// import lombok.AllArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.server.ResponseStatusException;
//
// @RestController
// @RequestMapping("/api/foods")
// @AllArgsConstructor
// public class FoodController {
//
// private final FoodService foodService;
// // Inject the bean instead of creating 'new' to ensure consistent config
// private final ObjectMapper objectMapper;
//
// @PostMapping(consumes = {"multipart/form-data"})
// public FoodResponse addFood(@RequestPart("food") String foodString,
// @RequestPart("file") MultipartFile file) {
// try {
// // This now matches the Catch block because both use com.fasterxml.jackson
// FoodRequest request = objectMapper.readValue(foodString, FoodRequest.class);
// return foodService.addFood(request, file);
//
// } catch (JsonProcessingException ex) {
// throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON
// format");
// }
// }
// }