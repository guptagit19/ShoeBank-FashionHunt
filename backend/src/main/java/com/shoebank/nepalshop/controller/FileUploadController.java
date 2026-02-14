package com.shoebank.nepalshop.controller;

import com.shoebank.nepalshop.dto.ApiResponse;
import com.shoebank.nepalshop.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/images")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @RequestParam("files") MultipartFile[] files) {

        List<String> uploadedUrls = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String url = cloudinaryService.upload(file);
                    uploadedUrls.add(url);
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", uploadedUrls));
        } catch (IOException e) {
            log.error("Failed to upload images to Cloudinary", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to upload images: " + e.getMessage()));
        }
    }
}
