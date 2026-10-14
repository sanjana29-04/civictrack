package com.civictrack.modules.attachment;

import com.civictrack.common.exceptions.BadRequestException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentStorageService {

    private static final Logger log = LoggerFactory.getLogger(AttachmentStorageService.class);

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".webp");
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private final Path rootLocation;

    public AttachmentStorageService(@Value("${app.storage.upload-dir:./uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
            log.info("Initialized secure upload directory at: {}", rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed limit of 10MB");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");

        // Validate extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file type. Only JPG, PNG, and WebP are allowed.");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file content type: " + contentType);
        }

        String storedFilename = UUID.randomUUID() + extension;

        try {
            Path destinationFile = this.rootLocation.resolve(storedFilename).normalize().toAbsolutePath();

            // Guard against directory traversal attacks
            if (!destinationFile.getParent().equals(this.rootLocation)) {
                throw new BadRequestException("Cannot store file outside current directory");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return storedFilename;
        } catch (IOException e) {
            log.error("Failed to store file: ", e);
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize().toAbsolutePath();

            if (!file.getParent().equals(rootLocation)) {
                throw new BadRequestException("Invalid file path request");
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Could not find file: " + filename);
        }
    }
}
