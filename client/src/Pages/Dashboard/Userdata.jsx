import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserDataAdmin } from '../../Redux/Slices/AuthSlice';
import toast from 'react-hot-toast';
import Layout from '../../Layout/Layout';

function Userdata() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    role: '',
    subscription: {
      status: ''
    }
  });
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(getAllUsers());
        setUsers(response.payload.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleEdit = (user) => {
    if (role !== 'ADMIN') {
      toast.error('Only admin can edit user data');
      return;
    }
    setEditingUser(user._id);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      subscription: {
        status: user.subscription?.status || 'inactive'
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'subscription') {
      setEditForm(prev => ({
        ...prev,
        subscription: {
          status: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (id) => {
    try {
      if (role !== 'ADMIN') {
        toast.error('Only admin can update user data');
        return;
      }

      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (key === 'subscription') {
          formData.append('subscription[status]', editForm.subscription.status);
        } else {
          formData.append(key, editForm[key]);
        }
      });

      await dispatch(updateUserDataAdmin({id, formData}));
      
      // Refresh user list
      const response = await dispatch(getAllUsers());
      setUsers(response.payload.users);
      
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200">Full Name</th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200">Email</th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200">Role</th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200">Subscription</th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  {editingUser === user._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleChange}
                          className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleChange}
                          className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleChange}
                          className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="subscription"
                          value={editForm.subscription.status}
                          onChange={handleChange}
                          className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSubmit(user._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user.fullName}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user.email}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded ${user.subscription?.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {user.subscription?.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Userdata;
