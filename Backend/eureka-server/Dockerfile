# Use lightweight OpenJDK image
FROM openjdk:17-jdk-slim


VOLUME /tmp

# Copy the jar file into container
COPY target/eureka-server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
