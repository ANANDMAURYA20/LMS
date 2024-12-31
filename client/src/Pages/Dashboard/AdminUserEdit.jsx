import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import toast from 'react-hot-toast';
import { getUserById } from '../../Redux/Slices/AuthSlice';
import { updateUserDataAdmin } from '../../Redux/Slices/AuthSlice';

function AdminUserEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    number: '',
    isEmailVerified: '',
    subscription: {
      status: 'inactive'
    }
  });

  useEffect(() => {
    // console.log('Component mounting, userId:', userId);

    const fetchUser = async () => {
      try {
        setLoading(true);
        // console.log('Fetching user data for ID:', userId);
        
        const response = await dispatch(getUserById(userId));
        // console.log('API Response:', response);

        if (response?.payload?.success) {
          const userData = response.payload.user;
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            number: userData.number || '',
            isEmailVerified: userData.isEmailVerified || false,
            role: userData.role || 'USER',
            subscription: {
              status: userData.subscription?.status || 'inactive'
            }
          });
        }
      } catch (error) {
        // console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Submitting form data:', formData);
    // console.log('User ID:', userId);

    try {
      const response = await dispatch(updateUserDataAdmin({
        id: userId,
        formData: formData
      }));
      // console.log('Update response:', response);

      if (response.payload) {
        navigate('/admin/userdata');
        toast.success('User updated successfully');
      }
    } catch (error) {
      // console.error('Full error object:', error);
      toast.error('Error updating user');
    }
  };

  if (loading) {
    return <Layout><div className="min-h-screen p-6">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit User</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Number</label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>


            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Verfication</label>
               <select
                value={formData.isEmailVerified}
                onChange={(e) => setFormData({...formData, isEmailVerified: e.target.value})}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            </div>

           
         

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Subscription Status</label>
              <select
                value={formData.subscription.status}
                onChange={(e) => setFormData({
                  ...formData, 
                  subscription: { status: e.target.value }
                })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/userdata')}
                className="px-4 py-2 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AdminUserEdit;
