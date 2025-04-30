import React from 'react';

const List = ({ expenses, onDelete, onUpdate }) => {
  // Handle the delete button click
  const handleDelete = (id) => {
    onDelete(id);  // Call the parent handler to delete the expense
  };

  // Handle the update button click (this can be customized to update specific fields)
  const handleUpdate = (expense) => {
    const updatedData = { amount: expense.amount + 10 }; // Example: increment amount by 10
    onUpdate(expense._id, updatedData);  // Pass the updated data to parent handler
  };
 
  return (
    <div className="bg-white shadow-md p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Expense List</h3>
      <ul className="space-y-4">
  {expenses.map((expense) => (
    <li key={expense._id} className="flex justify-between items-center border-b pb-2">
      <div className="flex-1">
        <div><strong>Category:</strong> {expense.category}</div>
        <div><strong>Amount:</strong> {expense.amount} rs</div>
        <div><strong>Description:</strong> {expense.description}</div>
        <div><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</div>
      </div>
      <div className="flex gap-2 ml-auto">
        <button onClick={() => handleDelete(expense._id)} className="text-red-500">Delete</button>
        <button onClick={() => handleUpdate(expense)} className="text-blue-500">Update</button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default List;
