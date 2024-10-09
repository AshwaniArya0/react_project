import React, { useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const Edit = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [], 
    img: null,
  });

  const { f_Email } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      img: e.target.files[0], 
    }));
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      if (checked) {
        return { ...prevFormData, course: [...prevFormData.course, value] };
      } else {
        return {
          ...prevFormData,
          course: prevFormData.course.filter((course) => course !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formToSubmit = new FormData();
    for (const key in formData) {
      formToSubmit.append(key, formData[key]);
    }

   
    console.log("Form Data Submitted: ", formData);

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/editEmployee/${f_Email}`, formToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      
      setFormData({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: [],
        img: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Employee Edit</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">Mobile No.:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Designation */}
          <div className="mb-4">
            <label htmlFor="designation" className="block text-gray-700 text-sm font-bold mb-2">Designation:</label>
            <select
              id="designation"
              name="designation"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              value={formData.designation}
              onChange={handleChange}
              required
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender:</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="form-radio"
                  required
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="form-radio"
                  required
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          {/* Course */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Course:</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="MCA"
                  checked={formData.course.includes("MCA")}
                  onChange={handleCourseChange}
                  className="form-checkbox"
                />
                <span className="ml-2">MCA</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BCA"
                  checked={formData.course.includes("BCA")}
                  onChange={handleCourseChange}
                  className="form-checkbox"
                />
                <span className="ml-2">BCA</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BSC"
                  checked={formData.course.includes("BSC")}
                  onChange={handleCourseChange}
                  className="form-checkbox"
                />
                <span className="ml-2">BSC</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="img" className="block text-gray-700 text-sm font-bold mb-2">Upload Image:</label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              className="block w-full text-gray-700 border rounded py-2 px-3"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
