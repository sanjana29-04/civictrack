# Multi-stage Dockerfile for CivicTrack 2.0 Backend
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build artifact
COPY src ./src
RUN mvn clean package -DskipTests

# Production runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN addgroup --system civictrack && adduser --system --ingroup civictrack civictrack
COPY --from=builder /app/target/civictrack-backend-2.0.0.jar app.jar

# Directory for file uploads
RUN mkdir -p uploads && chown -R civictrack:civictrack /app
USER civictrack

EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
