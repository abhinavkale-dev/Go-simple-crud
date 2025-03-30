import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>('http://localhost:8080/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      const response = await axios.post<Todo>('http://localhost:8080/api/todos', {
        title: newTodoTitle,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTodoId === null) return;
    try {
      const response = await axios.put<Todo>(`http://localhost:8080/api/todos/${editTodoId}`, {
        title: editTodoTitle,
        completed: false,
      });
      setTodos(todos.map(todo => (todo.id === editTodoId ? response.data : todo)));
      setEditTodoId(null);
      setEditTodoTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleTodoCompleted = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await axios.put<Todo>(`http://localhost:8080/api/todos/${todo.id}`, updatedTodo);
      setTodos(todos.map(t => (t.id === todo.id ? response.data : t)));
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Todo App</h1>
      <form onSubmit={addTodo} className="flex items-center mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter new todo"
          className="w-4/5 p-2 mr-2 border border-gray-300 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Todo
        </button>
      </form>

      <ul className="mt-5 space-y-4">
        {todos.map(todo => (
          <li key={todo.id} className="border-b border-gray-300 pb-2">
            {editTodoId === todo.id ? (
              <form onSubmit={updateTodo} className="flex items-center">
                <input 
                  type="text"
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                  className="w-3/5 p-2 mr-2 border border-gray-300 rounded"
                />
                <button type="submit" className="p-2 bg-green-500 text-white rounded">
                  Update
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditTodoId(null)}
                  className="p-2 bg-red-500 text-white rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompleted(todo)}
                  className="h-5 w-5"
                />
                <span className="text-lg ml-2 flex-1">
                  {todo.title}
                </span>
                <button 
                  onClick={() => {
                    setEditTodoId(todo.id);
                    setEditTodoTitle(todo.title);
                  }}
                  className="ml-2 p-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-2 p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;