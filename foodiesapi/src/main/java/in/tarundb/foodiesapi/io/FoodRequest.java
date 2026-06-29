package in.tarundb.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodRequest {
    private String name;
    private String description;
    private double price;
    private String category;





}
