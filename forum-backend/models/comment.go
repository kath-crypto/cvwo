package models

import "time"

type Comment struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Content   string    `gorm:"type:text;not null" json:"content"`
    PostID    uint      `gorm:"not null" json:"post_id"`
    Post      Post      `gorm:"foreignKey:PostID" json:"post,omitempty"`
    UserID    uint      `gorm:"not null" json:"user_id"`
    User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    ParentID  *uint     `gorm:"default:null" json:"parent_id,omitempty"`
    Parent    *Comment  `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
    Replies   []Comment `gorm:"foreignKey:ParentID" json:"replies,omitempty"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type CreateCommentRequest struct {
    Content  string `json:"content" binding:"required,min=1"`
    PostID   uint   `json:"post_id" binding:"required"`
    ParentID *uint  `json:"parent_id"`
}

type UpdateCommentRequest struct {
    Content string `json:"content" binding:"required,min=1"`
}