package handlers

import (
	"net/http"
	"strconv"

	"slices"

	"github.com/abhinavkale-dev/Go-todo-list/models"
	"github.com/gin-gonic/gin"
)

var todos = []models.Todo{
	{ID: 1, Title: "Learn Gin", Completed: false},
	{ID: 2, Title: "Build a Todo App", Completed: false},
}

func GetTodos(c *gin.Context) {
	c.JSON(http.StatusOK, todos)
}

func CreateTodo(c *gin.Context) {
	var newTodo models.Todo
	err := c.BindJSON(&newTodo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newTodo.ID = len(todos) + 1
	todos = append(todos, newTodo)
	c.JSON(http.StatusOK, newTodo)
}

func UpdateTodos(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var updatedTodos models.Todo
	if err := c.BindJSON(&updatedTodos); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for i, t := range todos {
		if t.ID == id {
			todos[i].Title = updatedTodos.Title
			todos[i].Completed = updatedTodos.Completed
			c.JSON(http.StatusOK, todos[i])
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}

func DeleteTodos(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	for i, t := range todos {
		if t.ID == id {
			todos = slices.Delete(todos, i, i+1)
			c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}
