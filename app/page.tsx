"use client"
import React, { useState, useEffect } from 'react';

// Define a type for the Todo items for better type checking
interface TodoItem {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

const url = process.env.url
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string>('');
  const [editedTodo, setEditedTodo] = useState<Partial<TodoItem>>({});
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [newTodoDescription, setNewTodoDescription] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch(`/todos/`);
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

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/todos/${id}`, {
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

  const handleCreateTodo = async () => {
    try {
      const response = await fetch(`/todos/`, {
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

  const handleUpdateTodo = async (id: number, updatedTodo: Partial<TodoItem>) => {
    try {
      const response = await fetch(`/todos/${id}`, {
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

  const handleEdit = (id: number, todo: TodoItem) => {
    setEditedTodo(todo);
    setIsEditing(id);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTodo),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      fetchData(); // Refresh todos after update
      setEditedTodo({});
      setIsEditing(null);
    } catch (error) {
      console.error('There was an error!', error);
      setError('Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditedTodo({});
    setIsEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-pink-600 flex justify-center items-center">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-800">Todo List</h1>
        <div className="flex justify-center items-center mb-6">
          <input
            type="text"
            placeholder="New Todo Title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="border rounded p-2 mr-2 focus:outline-none"
          />
          <input
            type="text"
            placeholder="New Todo Description"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            className="border rounded p-2 mr-2 focus:outline-none"
          />
          <button onClick={handleCreateTodo} className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded hover:shadow-md focus:outline-none">Add Todo</button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-col">
              <div className="flex flex-col justify-start items-start mb-2">
                <span>Todo Id: {todo.id}</span>
                {isEditing === todo.id ? (
                  <div className="flex items-center justify-between w-full">
                    <input
                      type="text"
                      value={editedTodo.title || ''}
                      onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
                      className="border rounded p-2 mr-2 focus:outline-none flex-1"
                    />
                    <input
                      type="text"
                      value={editedTodo.description || ''}
                      onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
                      className="border rounded p-2 mr-2 focus:outline-none flex-1"
                    />
                    <button onClick={() => handleSaveEdit(todo.id)} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded hover:shadow-md focus:outline-none">Save</button>
                    <button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded hover:shadow-md focus:outline-none">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold">Title : {todo.title}</h2>
                    <div className="flex items-center">
                      <button onClick={() => handleEdit(todo.id, todo)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded hover:shadow-md focus:outline-none">Edit</button>
                      <button onClick={() => handleDeleteTodo(todo.id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 ml-4 rounded hover:shadow-md focus:outline-none">Delete</button>
                      <button onClick={() => handleUpdateTodo(todo.id, { completed: !todo.completed })} className={`bg-${todo.completed ? 'green' : 'pink'}-600 hover:bg-${todo.completed ? 'green' : 'pink'}-700 text-white py-2 px-4 ml-4 rounded hover:shadow-md focus:outline-none`}>{todo.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">Description : {todo.description || 'No Description'}</p>
              <p className={`text-sm ${todo.completed ? 'text-green-600' : 'text-red-600'}`}>Status : {todo.completed ? 'Completed' : 'Not Completed'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
