import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await fetch(`${BASE_URL}/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
        await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ name: '', email: '', course: '' });
      fetchStudents();
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleEdit = (student) => {
    setFormData({ name: student.Name, email: student.Email, course: student.Course });
    setEditingId(student.ID);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE',
      });
      fetchStudents();
    } catch (err) {
      console.error('Deletion failed:', err);
    }
  };

  return (
    <div className="container">
      <div className="theme-toggle">
        <label>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </label>
      </div>

      <h2>Student Portal</h2>

      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
        <button type="submit" className="register-btn" style={{ backgroundColor: '#9deaa5' }}>
          {editingId ? 'Update' : 'Register'}
        </button>
      </form>

      <div className="student-list">
        <h3>Registered Students</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(students) ? (
    students.length > 0 ? (
      students.map((student) => (
        <tr key={student.ID}>
          <td>{student.Name}</td>
          <td>{student.Email}</td>
          <td>{student.Course}</td>
          <td>
            <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(student.ID)}>Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="4">No students registered yet.</td></tr>
    )
  ) : (
    <tr><td colSpan="4">Error loading students. Please check server.</td></tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default App;
