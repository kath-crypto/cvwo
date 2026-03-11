package routes

import (
    "forum/handlers"
    "forum/middleware"
    "github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
    // Apply auth middleware globally
    router.Use(middleware.Auth())

    // API v1 group
    v1 := router.Group("/api/v1")
    {
        // Auth routes
        auth := v1.Group("/auth")
        {
            auth.POST("/register", handlers.Register)
            auth.POST("/login", handlers.Login)
            auth.GET("/profile", middleware.RequireAuth(), handlers.GetProfile)
        }

        // Topic routes
        topics := v1.Group("/topics")
        {
            topics.GET("/", handlers.GetTopics)
            topics.GET("/:id", handlers.GetTopic)
            topics.POST("/", middleware.RequireAuth(), handlers.CreateTopic)
            topics.PUT("/:id", middleware.RequireAuth(), handlers.UpdateTopic)
            topics.DELETE("/:id", middleware.RequireAuth(), handlers.DeleteTopic)
        }

        // Post routes
        posts := v1.Group("/posts")
        {
            posts.GET("/", handlers.GetPosts)
            posts.GET("/:id", handlers.GetPost)
            posts.POST("/", middleware.RequireAuth(), handlers.CreatePost)
            posts.PUT("/:id", middleware.RequireAuth(), handlers.UpdatePost)
            posts.DELETE("/:id", middleware.RequireAuth(), handlers.DeletePost)
        }

        // Comment routes
        comments := v1.Group("/comments")
        {
            comments.GET("/post/:postId", handlers.GetComments)
            comments.POST("/", middleware.RequireAuth(), handlers.CreateComment)
            comments.PUT("/:id", middleware.RequireAuth(), handlers.UpdateComment)
            comments.DELETE("/:id", middleware.RequireAuth(), handlers.DeleteComment)
        }
    }
}