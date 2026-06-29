package in.tarundb.foodiesapi.repository;

import in.tarundb.foodiesapi.Entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends MongoRepository<FoodEntity,String> {


}
