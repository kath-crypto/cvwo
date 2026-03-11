package models

import "time"

type Post struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Title     string    `gorm:"size:255;not null" json:"title"`
    Content   string    `gorm:"type:text;not null" json:"content"`
    TopicID   uint      `gorm:"not null" json:"topic_id"`
    Topic     Topic     `gorm:"foreignKey:TopicID" json:"topic,omitempty"`
    UserID    uint      `gorm:"not null" json:"user_id"`
    User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    Comments  []Comment `gorm:"foreignKey:PostID" json:"comments,omitempty"`
    CommentCount int64  `gorm:"-" json:"comment_count"`
}

type CreatePostRequest struct {
    Title   string `json:"title" binding:"required,min=1,max=255"`
    Content string `json:"content" binding:"required,min=1"`
    TopicID uint   `json:"topic_id" binding:"required"`
}

type UpdatePostRequest struct {
    Title   string `json:"title" binding:"omitempty,min=1,max=255"`
    Content string `json:"content" binding:"omitempty,min=1"`
}