# Step 1: Use lightweight Java runtime image
FROM openjdk:17-jdk-slim

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy the built ContentService JAR into container
COPY target/Travyway-0.0.1-SNAPSHOT.jar Travyway.jar

# Step 4: Expose the port your service runs on (change if needed)
EXPOSE 8082

# Step 5: Run the JAR
ENTRYPOINT ["java", "-jar", "Travyway.jar"]
