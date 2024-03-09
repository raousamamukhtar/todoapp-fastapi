import axios from 'axios';

const API_URL = 'http://localhost:8000/todos/';

export interface TodoItem {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
}

// Fetch all todos
export const fetchTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>(API_URL);
  return response.data;
};

// Add a new todo
export const addTodo = async (todo: TodoItem): Promise<TodoItem> => {
  const response = await axios.post<TodoItem>(API_URL, todo);
  return response.data;
};

// Update an existing todo
export const updateTodo = async (id: number, todo: TodoItem): Promise<TodoItem> => {
  const response = await axios.put<TodoItem>(`${API_URL}${id}/`, todo);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/`);
};
