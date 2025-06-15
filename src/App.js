import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // 🌗 Toggle state

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:3000/students');
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId !== null) {
      await fetch(`http://localhost:3000/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ name: '', email: '', course: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setFormData({ name: student.Name, email: student.Email, course: student.Course });
    setEditingId(student.ID);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/students/${id}`, {
      method: 'DELETE',
    });
    fetchStudents();
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
        <button
          type="submit"
          className="register-btn"
          style={{ backgroundColor: '#9deaa5' }}
        >
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
            {students.map((student) => (
              <tr key={student.ID}>
                <td>{student.Name}</td>
                <td>{student.Email}</td>
                <td>{student.Course}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student.ID)}>Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="4">No students registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
