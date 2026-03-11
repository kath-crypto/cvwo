package config

import (
    "fmt"
    "log"
    "forum/models"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
    db, err := gorm.Open(sqlite.Open("forum.db"), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }
    fmt.Println("Database connection established")

    // Auto migrate schemas
    if err := db.AutoMigrate(
        &models.User{},
        &models.Topic{},
        &models.Post{},
        &models.Comment{},
    ); err != nil {
        log.Fatal("Failed to migrate database: ", err)
    }
    fmt.Println("Database migration completed")
    
    DB = db
}
