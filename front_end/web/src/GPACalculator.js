import React, { useState } from 'react';

const GPACalculator = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '', credits: '' });
  const [gpa, setGPA] = useState(0);

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, newCourse]);
    setNewCourse({ name: '', grade: '', credits: '' });
  };

  const handleDeleteCourse = (index) => {
    const updatedCourses = courses.filter((course, i) => i !== index);
    setCourses(updatedCourses);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach((course) => {
      const { grade, credits } = course;
      const points = getGradePoints(grade);
      totalPoints += points * parseInt(credits);
      // console(totalPoints);
      totalCredits += parseInt(credits);
      // console(totalCredits);
    });
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGPA(gpa.toFixed(2));
  };

  const getGradePoints = (grade) => {
    switch (grade) {
      case 'A+': return 4.0;
      case 'A': return 4.0;
      case 'A-': return 3.67;
      case 'B+': return 3.33;
      case 'B': return 3.0;
      case 'B-': return 2.67;
      case 'C+': return 2.33;
      case 'C': return 2.0;
      case 'C-': return 1.67;
      case 'D+': return 1.33;
      case 'D': return 1.0;
      case 'D-': return 0.67;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  return (
    <div className="gpa-calculator">
      <h2>GPA Calculator</h2>
      <form onSubmit={handleAddCourse}>
        <input type="text" name="name" value={newCourse.name} onChange={handleInputChange} placeholder="Course Name" />
        <input type="text" name="grade" value={newCourse.grade} onChange={handleInputChange} placeholder="Grade" />
        <input type="number" name="credits" value={newCourse.credits} onChange={handleInputChange} placeholder="Credits" />
        <button type="submit">Add Course</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Grade</th>
            <th>Credits</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.name}</td>
              <td>{course.grade}</td>
              <td>{course.credits}</td>
              <td><button onClick={() => handleDeleteCourse(index)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={calculateGPA}>Calculate GPA</button>
      <p>Your GPA: {gpa}</p>
    </div>
  );
};

export default GPACalculator;
