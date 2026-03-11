package models

import "time"

type Topic struct {
    ID          uint      `gorm:"primaryKey" json:"id"`
    Title       string    `gorm:"size:255;not null" json:"title"`
    Description string    `gorm:"type:text" json:"description"`
    UserID      uint      `gorm:"not null" json:"user_id"`
    User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    CreatedAt   time.Time `json:"created_at"`
    PostCount   int64     `gorm:"-" json:"post_count"` // Computed field
}

type CreateTopicRequest struct {
    Title       string `json:"title" binding:"required,min=1,max=255"`
    Description string `json:"description"`
}