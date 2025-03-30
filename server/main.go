package main

import (
	"github.com/abhinavkale-dev/Go-todo-list/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.Use(cors.Default())
	router.SetTrustedProxies([]string{"127.0.0.1"})

	api := router.Group("/api")
	{
		api.GET("/todos", handlers.GetTodos)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodos)
		api.DELETE("/todos/:id", handlers.DeleteTodos)

	}

	router.Run(":8080")
}
