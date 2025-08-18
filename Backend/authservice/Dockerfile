# Step 1: Use lightweight Java runtime image
FROM openjdk:17-jdk-slim

# Step 2: Set a directory for the app
WORKDIR /app

# Step 3: Copy the JAR file into the container
# Replace 'authservice-0.0.1-SNAPSHOT.jar' with your actual JAR name
COPY target/authservice-0.0.1-SNAPSHOT.jar authservice.jar

# Step 4: Expose the port your service runs on (default is 8080, change if needed)
EXPOSE 8083

# Step 5: Run the JAR
ENTRYPOINT ["java", "-jar", "authservice.jar"]
