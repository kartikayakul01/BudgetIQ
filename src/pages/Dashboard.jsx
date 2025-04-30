import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './DashboardComponants/PieChart';
import BarChart from './DashboardComponants/BarChart';
import List from './DashboardComponants/List';
import Loader from './Loader';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: ''
  });

  const [editingExpense, setEditingExpense] = useState(null); // For tracking the expense being updated

  // Fetch the expense data when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const start = Date.now(); // Record start time
  
        const response = await axios.get(import.meta.env.VITE_API_URL+'expenses');
  
        const timeElapsed = Date.now() - start;
        const delay = Math.max(1000 - timeElapsed, 0); // Ensure minimum 1 second
  
        setTimeout(() => {
          setExpenses(response.data);
          setLoading(false);
        }, delay);
  
      } catch (err) {
        setTimeout(() => {
          setError('Error fetching data');
          setLoading(false);
        }, 200); 
      }
    };
  
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'expenses', formData);
      setExpenses([...expenses, response.data]); // Add new expense to the state
      setShowForm(false); // Close the form
      setFormData({ category: '', description: '', amount: '', date: '' }); // Reset form
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL+`expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const handleUpdate = async (id) => {
    const expenseToUpdate = expenses.find(expense => expense._id === id);
    setFormData({
      category: expenseToUpdate.category,
      description: expenseToUpdate.description,
      amount: expenseToUpdate.amount,
      date: expenseToUpdate.date
    });
    setEditingExpense(expenseToUpdate); // Store the expense being edited
    setShowForm(true); // Open the form for updating
  };

  const handleSubmitForm = async () => {
    if (editingExpense) {
      // Update existing expense
      try {
        await axios.put(import.meta.env.VITE_API_URL+`expenses/${editingExpense._id}`, formData);
        setExpenses(expenses.map(expense => expense._id === editingExpense._id ? { ...expense, ...formData } : expense)); // Update the state
        setShowForm(false); // Close the form
        setFormData({ category: '', description: '', amount: '', date: '' }); // Reset form
        setEditingExpense(null); // Clear the editing state
      } catch (err) {
        console.error('Error updating expense:', err);
      }
    } else {
      // Add new expense
      handleAddExpense();
    }
  };

  if (loading) return <div className="p-6"><Loader /></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-8 relative bg-gradient-to-br from-green-100 to-yellow-300">
      {/* Blue overlay when form is visible */}
      {showForm && <div className="absolute inset-0 bg-blue-500 opacity-50 z-10"></div>}

      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Add Expense Button */}
      <button
        onClick={() => { setShowForm(true); setEditingExpense(null); }}
        className="absolute top-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        Add Expense
      </button>

      {/* Chart Grid (2-column on large screens, stacked on small) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-4 rounded-xl">
          <PieChart data={expenses} />
        </div>
        <div className="bg-white shadow-md p-4 rounded-xl">
          <BarChart data={expenses} />
        </div>
      </div>

      {/* Expense List */}
      <List expenses={expenses} onDelete={handleDelete} onUpdate={handleUpdate} />

      {/* Add Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-white z-20 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 bg-gradient-to-br from-green-100 to-pink-100">
            <h3 className="text-xl font-semibold mb-4">{editingExpense ? 'Update Expense' : 'Add New Expense'}</h3>
            <div className="space-y-4">
            <div>
  <label htmlFor="category" className="block text-sm">Category</label>
  <input
    id="category"
    list="category-options"
    type="text"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Select or type a category"
    required
  />
  <datalist id="category-options">
    {[
      'Groceries',
      'Fuel/Transportation',
      'Eating Out',
      'Utilities',
      'Personal Care',
      'Household Supplies',
      'Medical/Pharmacy',
      'Subscriptions',
      'Miscellaneous/Impulse Buys',
      'Commute Parking/Toll'
    ].map((category) => (
      <option key={category} value={category} />
    ))}
  </datalist>
</div>


              <div>
                <label htmlFor="description" className="block text-sm">Description</label>
                <input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm">Amount</label>
                <input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitForm}
                disabled={!formData.category || !formData.description || !formData.amount}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                {editingExpense ? 'Update' : 'Submit'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="ml-2 p-2 text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
