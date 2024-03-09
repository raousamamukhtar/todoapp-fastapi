"use client"
import React, { useState, useEffect } from 'react';

// Define a type for the Todo items for better type checking
interface TodoItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string>('');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [newTodoDescription, setNewTodoDescription] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('There was an error!', error);
      setError('Failed to load todos');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTodo = async () => {
    try {
      const response = await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      fetchData(); // Refresh todos after creation
      setNewTodoTitle('');
      setNewTodoDescription('');
    } catch (error) {
      console.error('There was an error!', error);
      setError('Failed to create todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      fetchData(); // Refresh todos after deletion
    } catch (error) {
      console.error('There was an error!', error);
      setError('Failed to delete todo');
    }
  };

  const handleUpdateTodo = async (id: number, updatedTodo: Partial<TodoItem>) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      fetchData(); // Refresh todos after update
    } catch (error) {
      console.error('There was an error!', error);
      setError('Failed to update todo');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Todo List</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Todo Title"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <input
          type="text"
          placeholder="New Todo Description"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button onClick={handleCreateTodo} className="bg-blue-500 text-white py-2 px-4 rounded">Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 p-2 bg-gray-100 rounded-md">
            <span>{todo.id}</span>
            <h2 className="font-semibold">{todo.title}</h2>
            <p>{todo.description || 'No Description'}</p>
            <p>{todo.completed ? 'Completed' : 'Not Completed'}</p>
            <button onClick={() => handleDeleteTodo(todo.id)} className="bg-red-500 text-white py-1 px-2 rounded">Delete</button>
            <button onClick={() => handleUpdateTodo(todo.id, { completed: !todo.completed })} className="bg-green-500 text-white py-1 px-2 rounded">{todo.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
