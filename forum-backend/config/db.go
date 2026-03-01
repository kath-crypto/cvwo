package config

import (
    "fmt"
    "log"
    "os"
    "forum/models"
    "github.com/joho/godotenv"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
    _ = godotenv.Load()
    dsn := os.Getenv("DB_DSN")
    if dsn == "" {
        log.Fatal("DB_DSN environment variable is not set")
    }

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }
    fmt.Println("Database connection established")

    if err := db.AutoMigrate(&models.User{}, &models.Topic{}, &models.Post{}, &models.Comment{}); err != nil {
        log.Fatal("Failed to migrate database: ", err)
    }
    fmt.Println("Database migration completed")
    DB = db
}
