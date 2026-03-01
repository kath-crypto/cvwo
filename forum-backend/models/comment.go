package models

import "time"

type Comment struct {
    ID        uint      `gorm:"primaryKey"`
    Content   string    `gorm:"type:text;not null"`
    PostID    uint      `gorm:"not null"`
    UserID    uint      `gorm:"not null"`
    ParentID  *uint     `gorm:"default:null"`
    CreatedAt time.Time
    UpdatedAt time.Time
}