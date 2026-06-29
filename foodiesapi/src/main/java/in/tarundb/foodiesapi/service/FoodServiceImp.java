//package in.tarundb.foodiesapi.service;
//
//import in.tarundb.foodiesapi.Entity.FoodEntity;
//import in.tarundb.foodiesapi.io.FoodRequest;
//import in.tarundb.foodiesapi.io.FoodResponse;
//import in.tarundb.foodiesapi.repository.FoodRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.server.ResponseStatusException;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectResponse;
//
//import java.io.IOException;
//import java.util.UUID;
//
//@Service
//@AllArgsConstructor
//public class FoodServiceImp implements FoodService {
//
//    private final S3Client s3Client;
//    private final FoodRepository foodRepository;
//
//    @Value("${aws.s3.bucketname}")
//    private String bucketName;
//
//    @Override
//    public String uploadFile(MultipartFile file) {
//        String filenameExtention =  file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
//        String key = UUID.randomUUID().toString()+"."+filenameExtention;
//        try{
//            PutObjectRequest putObjectRequest=PutObjectRequest.builder()
//                    .bucket(bucketName)
//                    .key(key)
//                    .acl("public-read")
//                    .contentType(file.getContentType())
//                    .build();
//            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
//            if(response.sdkHttpResponse().isSuccessful()){
//                return  "https://"+bucketName+"s3.amazonaws.com/"+key;
//            }else {
//                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"File uplode failed  ");
//
//            }
//        }catch (IOException ex){
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occured while uploading a file");
//
//        }
//    }
//
//    @Override
//    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
//
//       FoodEntity newFoodEntity= convertToEntity(request);
//       String imagUrl =  uploadFile(file);
//       newFoodEntity.setImageUrl(imagUrl);
//       newFoodEntity=foodRepository.save(newFoodEntity);
//       return convertToResponse(newFoodEntity);
//
//
//    }
//    private FoodEntity convertToEntity(FoodRequest request){
//    return FoodEntity.builder()
//             .name(request.getName())
//             .description(request.getDescription())
//             .category(request.getCategory())
//             .price(request.getPrice())
//             .build();
//    }
//    private FoodResponse convertToResponse(FoodEntity entity){
//        return FoodResponse.builder()
//                .id(entity.getId())
//                .name(entity.getName())
//                .description(entity.getDescription())
//                .category(entity.getCategory())
//                .price(entity.getPrice())
//                .imageUrl(entity.getImageUrl())
//                .build();
//    }
//}
package in.tarundb.foodiesapi.service;

import in.tarundb.foodiesapi.Entity.FoodEntity;
import in.tarundb.foodiesapi.io.FoodRequest;
import in.tarundb.foodiesapi.io.FoodResponse;
import in.tarundb.foodiesapi.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FoodServiceImp implements FoodService {

    private final S3Client s3Client;
    private final FoodRepository foodRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public FoodServiceImp(S3Client s3Client, FoodRepository foodRepository) {
        this.s3Client = s3Client;
        this.foodRepository = foodRepository;
    }

    @Override
    public String uploadFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File is required");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String key = UUID.randomUUID() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes()));

            if (response.sdkHttpResponse().isSuccessful()) {
                return String.format(
                        "https://%s.s3.%s.amazonaws.com/%s",
                        bucketName,
                        region,
                        key);
            }

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "File upload failed");

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error while uploading file",
                    ex);
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {

        FoodEntity foodEntity = convertToEntity(request);

        // persist the basic information first so it exists even if upload fails
        foodEntity = foodRepository.save(foodEntity);

        if (file != null && !file.isEmpty()) {
            try {
                String imageUrl = uploadFile(file);
                foodEntity.setImageUrl(imageUrl);
                // update record with the image URL
                foodEntity = foodRepository.save(foodEntity);
            } catch (ResponseStatusException ex) {
                // log and continue; the entity is already stored without image
                // if desired, you could rethrow or handle differently
                System.err.println("Warning: failed to upload image - " + ex.getMessage());
            }
        }

        return convertToResponse(foodEntity);
    }

    @Override
    public List<FoodResponse> readfoods() {
        List<FoodEntity> databaseEntries=foodRepository.findAll();
        return databaseEntries.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity existingFood =foodRepository.findById(id).orElseThrow(()-> new RuntimeException("Food not found for id :"+ id));
        return convertToResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        DeleteObjectRequest deleteObjectRequest =DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response=readFood(id);
        String imageUrl=  response.getImageUrl();
        String filename=imageUrl.substring(imageUrl.lastIndexOf("/")+1);
        boolean isFileDelete=deleteFile(filename);
        if (isFileDelete){
            foodRepository.deleteById(response.getId());
        }
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}