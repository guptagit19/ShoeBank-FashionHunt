package com.shoebank.nepalshop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
        log.info("Cloudinary initialized for cloud: {}", cloudName);
    }

    /**
     * Upload a file to Cloudinary and return the secure URL.
     */
    @SuppressWarnings("unchecked")
    public String upload(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "shoebank",
                        "resource_type", "auto"
                )
        );
        String secureUrl = (String) uploadResult.get("secure_url");
        log.info("Uploaded to Cloudinary: {}", secureUrl);
        return secureUrl;
    }

    /**
     * Delete an image from Cloudinary by its public ID.
     */
    @SuppressWarnings("unchecked")
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Deleted from Cloudinary: {}", publicId);
    }
}
