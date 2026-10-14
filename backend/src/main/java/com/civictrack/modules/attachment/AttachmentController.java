package com.civictrack.modules.attachment;

import com.civictrack.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
@Tag(name = "Attachments", description = "File upload and asset serving endpoints")
public class AttachmentController {

    private final AttachmentStorageService storageService;

    public AttachmentController(AttachmentStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an image (JPEG, PNG, WebP) up to 10MB")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String storedFilename = storageService.storeFile(file);
        String fileUrl = "/api/uploads/" + storedFilename;

        Map<String, String> response = new HashMap<>();
        response.put("filename", storedFilename);
        response.put("url", fileUrl);
        response.put("contentType", file.getContentType());
        response.put("size", String.valueOf(file.getSize()));

        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping("/uploads/{filename:.+}")
    @Operation(summary = "Serve uploaded media file")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.loadAsResource(filename);

        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(file.getFile().toPath());
        } catch (IOException ignored) {}

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(file);
    }
}
