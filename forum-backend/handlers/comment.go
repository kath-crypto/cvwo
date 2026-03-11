package handlers

import (
    "net/http"
    "forum/config"
    "forum/models"
    "github.com/gin-gonic/gin"
)

// GetComments returns comments for a post
func GetComments(c *gin.Context) {
    postID := c.Param("postId")
    
    var comments []models.Comment
    if err := config.DB.Preload("User").
        Where("post_id = ? AND parent_id IS NULL", postID).
        Order("created_at ASC").
        Find(&comments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
        return
    }

    // Load replies for each comment
    for i := range comments {
        loadCommentReplies(&comments[i])
    }

    c.JSON(http.StatusOK, comments)
}

// Helper function to load comment replies recursively
func loadCommentReplies(comment *models.Comment) {
    config.DB.Preload("User").
        Where("parent_id = ?", comment.ID).
        Order("created_at ASC").
        Find(&comment.Replies)
    
    for i := range comment.Replies {
        loadCommentReplies(&comment.Replies[i])
    }
}

// CreateComment creates a new comment
func CreateComment(c *gin.Context) {
    var req models.CreateCommentRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Check if post exists
    var post models.Post
    if err := config.DB.First(&post, req.PostID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Post does not exist"})
        return
    }

    // If parent_id provided, check if it exists
    if req.ParentID != nil {
        var parentComment models.Comment
        if err := config.DB.First(&parentComment, *req.ParentID).Error; err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Parent comment does not exist"})
            return
        }
    }

    comment := models.Comment{
        Content:  req.Content,
        PostID:   req.PostID,
        UserID:   userID.(uint),
        ParentID: req.ParentID,
    }

    if err := config.DB.Create(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
        return
    }

    // Load user data
    config.DB.Preload("User").First(&comment, comment.ID)

    c.JSON(http.StatusCreated, comment)
}

// UpdateComment updates an existing comment
func UpdateComment(c *gin.Context) {
    id := c.Param("id")
    var req models.UpdateCommentRequest
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, _ := c.Get("userID")
    
    // Check if comment exists and user owns it
    var comment models.Comment
    if err := config.DB.First(&comment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
        return
    }

    if comment.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this comment"})
        return
    }

    // Update comment
    if err := config.DB.Model(&comment).Update("content", req.Content).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
        return
    }

    c.JSON(http.StatusOK, comment)
}

// DeleteComment deletes a comment
func DeleteComment(c *gin.Context) {
    id := c.Param("id")
    
    userID, _ := c.Get("userID")
    
    // Check if comment exists and user owns it
    var comment models.Comment
    if err := config.DB.First(&comment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
        return
    }

    if comment.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this comment"})
        return
    }

    // Delete comment (cascades to replies due to database constraints)
    if err := config.DB.Delete(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}