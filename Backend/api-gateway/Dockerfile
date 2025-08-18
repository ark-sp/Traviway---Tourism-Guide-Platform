# Use lightweight OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the jar file into container
COPY target/api-gateway-0.0.1-SNAPSHOT.jar app.jar


# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
