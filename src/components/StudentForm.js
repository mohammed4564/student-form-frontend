
import React, { useEffect, useState } from "react";

import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../services/studentApi";

import "./StudentForm.css";

function StudentForm() {

    const initialForm = {
        name: "",
        age: "",
        email: "",
        course: ""
    };

    const [formData, setFormData] = useState(initialForm);
    const [students, setStudents] = useState([]);
    const [editId, setEditId] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            setLoading(true);

            const response = await getStudents();

            setStudents(response.data);

        } catch (error) {
            console.error(error);
            alert("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Create or update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            age: Number(formData.age)
        };

        try {

            if (editId) {

                await updateStudent(editId, data);

                alert("Student updated successfully");

            } else {

                await createStudent(data);

                alert("Student created successfully");
            }

            setFormData(initialForm);
            setEditId(null);

            fetchStudents();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Something went wrong"
            );
        }
    };

    // Edit student
    const handleEdit = (student) => {

        setEditId(student.id);

        setFormData({
            name: student.name,
            age: student.age,
            email: student.email,
            course: student.course
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Search student by ID
    const handleSearch = async () => {

        if (!searchId) {
            fetchStudents();
            return;
        }

        try {

            const response = await getStudentById(searchId);

            setStudents([response.data]);

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Student not found"
            );

            setStudents([]);
        }
    };

    // Delete student
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {

            await deleteStudent(id);

            alert("Student deleted successfully");

            fetchStudents();

        } catch (error) {

            console.error(error);

            alert("Failed to delete student");
        }
    };

    // Reset form
    const handleCancel = () => {
        setFormData(initialForm);
        setEditId(null);
    };

    return (

        <div className="student-container">

            <div className="student-header">
                <h1>Student Management</h1>
                <p>Manage your student records easily</p>
            </div>

            {/* Student Form */}

            <div className="form-card">

                <h2>
                    {editId ? "Update Student" : "Student Registration"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Student Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter student name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Age</label>

                            <input
                                type="number"
                                name="age"
                                placeholder="Enter age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Course</label>

                            <input
                                type="text"
                                name="course"
                                placeholder="Enter course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="form-buttons">

                        <button type="submit" className="btn-primary">
                            {editId ? "Update Student" : "Add Student"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            {/* Student List */}

            <div className="table-card">

                <div className="table-header">

                    <h2>Student Records</h2>

                    <div className="search-box">

                        <input
                            type="number"
                            placeholder="Search by ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />

                        <button onClick={handleSearch}>
                            Search
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setSearchId("");
                                fetchStudents();
                            }}
                        >
                            Reset
                        </button>

                    </div>

                </div>

                <div className="table-responsive">

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="6" className="empty-message">
                                        Loading students...
                                    </td>
                                </tr>

                            ) : students.length > 0 ? (

                                students.map((student) => (

                                    <tr key={student.id}>

                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>{student.email}</td>
                                        <td>{student.course}</td>

                                        <td className="action-buttons">

                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="6" className="empty-message">
                                        No students found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="record-count">
                    Total Students: {students.length}
                </div>

            </div>

        </div>
    );
}

export default StudentForm;
