package models

import "time"

type Topic struct {
    ID          uint      `gorm:"primaryKey"`
    Title       string    `gorm:"size:255;not null"`
    Description string    `gorm:"type:text"`
    UserID      uint      `gorm:"not null"`
    CreatedAt   time.Time
}