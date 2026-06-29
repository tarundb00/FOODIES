package in.tarundb.foodiesapi.service;

import in.tarundb.foodiesapi.io.FoodRequest;
import in.tarundb.foodiesapi.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);
    List<FoodResponse> readfoods();

    FoodResponse readFood(String id);

    boolean deleteFile(String filename);

    void deleteFood(String id);

}

