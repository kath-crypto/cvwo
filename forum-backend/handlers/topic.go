package handlers

import (
    "net/http"
    "forum/config"
    "forum/models"
    "github.com/gin-gonic/gin"
)

// GetTopics returns all topics with post counts
func GetTopics(c *gin.Context) {
    var topics []models.Topic
    
    // Get topics with post count
    if err := config.DB.Preload("User").Find(&topics).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
        return
    }

    // Get post counts for each topic
    for i := range topics {
        var count int64
        config.DB.Model(&models.Post{}).Where("topic_id = ?", topics[i].ID).Count(&count)
        topics[i].PostCount = count
    }

    c.JSON(http.StatusOK, topics)
}

// GetTopic returns a single topic with its posts
func GetTopic(c *gin.Context) {
    id := c.Param("id")
    var topic models.Topic

    if err := config.DB.Preload("User").First(&topic, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
        return
    }

    // Get post count
    var count int64
    config.DB.Model(&models.Post{}).Where("topic_id = ?", topic.ID).Count(&count)
    topic.PostCount = count

    c.JSON(http.StatusOK, topic)
}

// CreateTopic creates a new topic
func CreateTopic(c *gin.Context) {
    var req models.CreateTopicRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    topic := models.Topic{
        Title:       req.Title,
        Description: req.Description,
        UserID:      userID.(uint),
    }

    if err := config.DB.Create(&topic).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
        return
    }

    // Load user data
    config.DB.Preload("User").First(&topic, topic.ID)

    c.JSON(http.StatusCreated, topic)
}

// UpdateTopic updates an existing topic
func UpdateTopic(c *gin.Context) {
    id := c.Param("id")
    var req models.CreateTopicRequest
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    userID, _ := c.Get("userID")
    
    // Check if topic exists and user owns it
    var topic models.Topic
    if err := config.DB.First(&topic, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
        return
    }

    if topic.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this topic"})
        return
    }

    // Update topic
    updates := map[string]interface{}{
        "title":       req.Title,
        "description": req.Description,
    }

    if err := config.DB.Model(&topic).Updates(updates).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update topic"})
        return
    }

    c.JSON(http.StatusOK, topic)
}

// DeleteTopic deletes a topic
func DeleteTopic(c *gin.Context) {
    id := c.Param("id")
    
    userID, _ := c.Get("userID")
    
    // Check if topic exists and user owns it
    var topic models.Topic
    if err := config.DB.First(&topic, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
        return
    }

    if topic.UserID != userID.(uint) {
        c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this topic"})
        return
    }

    // Delete topic (cascades to posts and comments due to database constraints)
    if err := config.DB.Delete(&topic).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete topic"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
}