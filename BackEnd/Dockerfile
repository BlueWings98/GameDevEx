# Etapa de construcción
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ls -l /app
RUN if [ -f "./mvnw" ]; then echo "mvnw exists"; else echo "mvnw not found"; fi
RUN sed -i 's/\r$//' ./mvnw
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Etapa final
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]