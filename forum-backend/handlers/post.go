package handlers

import (
    "net/http"
    "forum/config"
    "forum/models"
    "github.com/gin-gonic/gin"
)

// GetPosts returns all posts, optionally filtered by topic
func GetPosts(c *gin.Context) {
    var posts []models.Post
    query := config.DB.Preload("User").Preload("Topic").Order("created_at DESC")

    // Filter by topic if provided
    if topicID := c.Query("topic_id"); topicID != "" {
        query = query.Where("topic_id = ?", topicID)
    }

    if err := query.Find(&posts).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
        return
    }

    // Get comment counts
    for i := range posts {
        var count int64
        config.DB.Model(&models.Comment{}).Where("post_id = ?", posts[i].ID).Count(&count)
        posts[i].CommentCount = count
    }

    c.JSON(http.StatusOK, posts)
}

// GetPost returns a single post with its comments
func GetPost(c *gin.Context) {
    id := c.Param("id")
    var post models.Post

    if err := config.DB.Preload("User").Preload("Topic").First(&post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    // Get comments
    var comments []models.Comment
    config.DB.Preload("User").Where("post_id = ? AND parent_id IS NULL", post.ID).Order("created_at ASC").Find(&comments)
    
    // Load replies for each comment
    for i := range comments {
        loadReplies(&comments[i])
    }
    
    post.Comments = comments
    
    // Get comment count
    var count int64
    config.DB.Model(&models.Comment{}).Where("post_id = ?", post.ID).Count(&count)
    post.CommentCount = count

    c.JSON(http.StatusOK, post)
}

// Helper function to load comment replies recursively
func loadReplies(comment *models.Comment) {
    config.DB.Preload("User").Where("parent_id = ?", comment.ID).Order("created_at ASC").Find(&comment.Replies)
    for i := range comment.Replies {
        loadReplies(&comment.Replies[i])
    }
}

// CreatePost creates a new post
func CreatePost(c *gin.Context) {
    var req models.CreatePostRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Check if topic exists
    var topic models.Topic
    if err := config.DB.First(&topic, req.TopicID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Topic does not exist"})
        return
    }

    post := models.Post{
        Title:   req.Title,
        Content: req.Content,
        TopicID: req.TopicID,
        UserID:  userID.(uint),
    }

    if err := config.DB.Create(&post).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
        return
    }

    // Load user and topic data
    config.DB.Preload("User").Preload("Topic").First(&post, post.ID)

    c.JSON(http.StatusCreated, post)
}

// UpdatePost updates an existing post
func UpdatePost(c *gin.Context) {
    id := c.Param("id")
    var req models.UpdatePostRequest
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, _ := c.Get("userID")
    
    // Check if post exists and user owns it
    var post models.Post
    if err := config.DB.First(&post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    if post.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this post"})
        return
    }

    // Update post
    updates := map[string]interface{}{}
    if req.Title != "" {
        updates["title"] = req.Title
    }
    if req.Content != "" {
        updates["content"] = req.Content
    }

    if err := config.DB.Model(&post).Updates(updates).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
        return
    }

    c.JSON(http.StatusOK, post)
}

// DeletePost deletes a post
func DeletePost(c *gin.Context) {
    id := c.Param("id")
    
    userID, _ := c.Get("userID")
    
    // Check if post exists and user owns it
    var post models.Post
    if err := config.DB.First(&post, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    if post.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this post"})
        return
    }

    // Delete post (cascades to comments due to database constraints)
    if err := config.DB.Delete(&post).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}