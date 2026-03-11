package handlers

import (
    "net/http"
    "forum/config"
    "forum/models"
    "forum/utils"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

// Register handles user registration
func Register(c *gin.Context) {
    var req models.CreateUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if username already exists
    var existingUser models.User
    if err := config.DB.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
        return
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Create user
    user := models.User{
        Username: req.Username,
        Password: string(hashedPassword),
    }

    if err := config.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusCreated, models.LoginResponse{
        ID:       user.ID,
        Username: user.Username,
        Token:    token,
    })
}

// Login handles user login
func Login(c *gin.Context) {
    var req models.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Find user
    var user models.User
    if err := config.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    // Generate JWT token
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, models.LoginResponse{
        ID:       user.ID,
        Username: user.Username,
        Token:    token,
    })
}

// GetProfile returns the current user's profile
func GetProfile(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    var user models.User
    if err := config.DB.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "id":        user.ID,
        "username":  user.Username,
        "created_at": user.CreatedAt,
    })
}
