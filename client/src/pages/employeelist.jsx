import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  useEffect(() => {
    
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/employee'); 
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/delete', { id });
      console.log(response.data.message);
      setEmployees(employees.filter(employee => employee.f_sno !== id));
    } catch (error) {
      console.error('Error deleting employee:', error.response?.data?.message || error.message);
    }
  };

  
  const filteredEmployees = employees.filter((employee) =>
    employee.f_Name.toLowerCase().includes(search.toLowerCase()) 
  );

  
  const sortEmployees = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setEmployees(sortedEmployees);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Create Employee
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>Total Count: {filteredEmployees.length}</div>
        <div>
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Enter Search Keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th onClick={() => sortEmployees('f_Id')} className="p-2 border cursor-pointer">Unique ID</th>
            <th className="p-2 border">Image</th>
            <th onClick={() => sortEmployees('f_Name')} className="p-2 border cursor-pointer">Name</th>
            <th onClick={() => sortEmployees('f_Email')} className="p-2 border cursor-pointer">Email</th>
            <th className="p-2 border">Mobile No</th>
            <th onClick={() => sortEmployees('f_Designation')} className="p-2 border cursor-pointer">Designation</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Course</th>
            <th onClick={() => sortEmployees('f_CreateDate')} className="p-2 border cursor-pointer">Create Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.f_Id}>
              <td className="ps-16 border">{employee.f_Id}</td>
              <td className="p-2 border">
                <img src={`http://localhost:3000/uploads/${employee.f_Image}`} alt={employee.f_Name} className="w-12 h-12 object-cover" />
              </td>
              <td className="p-2 border">{employee.f_Name}</td>
              <td className="p-2 border">{employee.f_Email}</td>
              <td className="p-2 border">{employee.f_Mobile}</td>
              <td className="p-2 border">{employee.f_Designation}</td>
              <td className="p-2 border">{employee.f_Gender}</td>
              <td className="p-2 border">{employee.f_Course}</td>
              <td className="p-2 border">{new Date(employee.f_CreateDate).toLocaleDateString()}</td>
              <td className="p-2 border">
                <Link className="bg-yellow-400 px-2 py-1 rounded text-white mr-2" to={`/edit/${employee.f_Email}`}>
                  Edit
                </Link>
                <button 
                  className="bg-red-500 px-2 py-1 rounded text-white" 
                  onClick={() => deleteEmployee(employee.f_Id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          {Array.from(
            { length: Math.ceil(filteredEmployees.length / employeesPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
