package models

import "time"

type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Username  string    `gorm:"size:100;unique;not null" json:"username"`
    Password  string    `gorm:"size:255;not null" json:"-"` // "-" excludes from JSON
    CreatedAt time.Time `json:"created_at"`
}

type CreateUserRequest struct {
    Username string `json:"username" binding:"required,min=3,max=50"`
    Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    ID       uint   `json:"id"`
    Username string `json:"username"`
    Token    string `json:"token"`
}