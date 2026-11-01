
import axios from "axios";

const BASE_URL = "https://student-form-o4v2.onrender.com";

// Create Student
export const createStudent = (data) =>
    axios.post(`${BASE_URL}/students/create`, data);

// Get All Students
export const getStudents = () =>
    axios.get(`${BASE_URL}/students/list`);

// Get Student By ID
export const getStudentById = (id) =>
    axios.get(`${BASE_URL}/students/${id}`);

// Update Student
export const updateStudent = (id, data) =>
    axios.put(`${BASE_URL}/students/update/${id}`, data);

// Delete Student
export const deleteStudent = (id) =>
    axios.delete(`${BASE_URL}/students/delete/${id}`);
