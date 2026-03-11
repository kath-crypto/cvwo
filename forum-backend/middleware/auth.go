package middleware

import (
    "net/http"
    "strings"
    "forum/utils"
    "github.com/gin-gonic/gin"
)

// Auth middleware to verify JWT token
func Auth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.Next() // Allow requests without token for public routes
            return
        }

        // Extract token from Bearer header
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header"})
            c.Abort()
            return
        }

        // Validate token
        userID, err := utils.ValidateToken(parts[1])
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
            c.Abort()
            return
        }

        // Set user ID in context
        c.Set("userID", userID)
        c.Next()
    }
}

// RequireAuth ensures user is authenticated
func RequireAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        userID, exists := c.Get("userID")
        if !exists || userID == nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
            c.Abort()
            return
        }
        c.Next()
    }
}