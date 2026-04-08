# --- Stage 1: Build Stage ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and download dependencies (for layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the application (skipping tests for faster builds)
RUN mvn package -DskipTests

# --- Stage 2: Run Stage ---
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port defined in application.properties
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
