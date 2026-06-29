package in.tarundb.foodiesapi.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AWSconfig {
    @Value("${AWS_ACCESS_KEY}")
    private String accesskey;
    @Value("${AWS_SECRET_KEY}")
    private  String secretkey;
    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client s3client(){
        return  S3Client.builder()
                .region(Region.of("eu-north-1"))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accesskey,secretkey)))
                .build();
    }

}

