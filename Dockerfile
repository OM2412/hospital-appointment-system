# Use official Maven image to build the backend
FROM maven:3.9-eclipse-temurin-25 AS builder

WORKDIR /app/backend

# Copy pom.xml and download dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Final stage - runtime image
FROM eclipse-temurin:25-jre

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/backend/target/*.war app.war

# Copy frontend dist files to static resources
COPY dist /app/static

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.war"]
