const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-purple-600 font-medium capitalize">{user?.role} Account</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <p className="text-gray-900">{user?.first_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <p className="text-gray-900">{user?.last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <p className="text-gray-900">{user?.phone_number}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <p className="text-purple-600 font-medium capitalize">{user?.role} Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;