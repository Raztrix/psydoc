package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	_ "github.com/go-sql-driver/mysql" // The underscore is critical!

	"server/handlers"
	"server/repository"
	"server/service"
)

func main() {
	// 1. Load Environment Variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}

	// 2. Database Connection
	// We build the connection string from .env vars
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		dbPort,
		dbHost,
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error connecting to DB: ", err)
	}
	defer db.Close()

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatal("Database unreachable: ", err)
	}
	fmt.Println("✅ Connected to MySQL successfully!")

	// 3. Dependency Injection (Wiring)
	// Repo -> Service -> Handler
	fileRepo := repository.NewFileRepo(db)
	fileService := service.NewFileService(fileRepo)
	fileHandler := handlers.NewFileHandler(fileService)

	// 4. Router Setup
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// CORS Setup (Critical for React)
	// This allows your frontend (localhost:3000 or 5173) to talk to this backend
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// 5. Routes
	r.Route("/api", func(r chi.Router) {
		// Health Check
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("OK"))
		})

		// File Routes
		r.Post("/upload", fileHandler.UploadFile)
		r.Get("/files", fileHandler.GetFiles)
		r.Get("/download/{id}", fileHandler.DownloadFile)
	})

	// 6. Start Server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Server running on port %s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal("Server crashed: ", err)
	}
}
