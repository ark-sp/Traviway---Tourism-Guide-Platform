# Step 1: Use lightweight Java runtime image
FROM openjdk:17-jdk-slim

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy the built ContentService JAR into container
COPY target/ContactService-0.0.1-SNAPSHOT.jar ContactService.jar

# Step 4: Expose the port your service runs on (change if needed)
EXPOSE 8087

# Step 5: Run the JAR
ENTRYPOINT ["java", "-jar", "ContactService.jar"]
