import Navbar from '@/components/NavBar/NavBar';
import PrimaryButton from '@/components/ui/PrimaryButton';
import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaUser, FaLock, FaSave } from 'react-icons/fa';
import { getUser } from '../utils/userUtils';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    password: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setProfileData(prevData => ({
        ...prevData,
        name: userData.name || '',
      }));

      // If user has an avatar, set it as preview
      if (userData.avatar) {
        setImagePreview(userData.avatar);
      }
    }
  }, []);

  const handleImageSelect = event => {
    const file = event.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='container mx-auto px-4 py-4'>
        <div className='max-w-xl mx-auto'>
          {/* Header */}
          {/* <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Profile Settings</h1>
            <p className='text-gray-600'>Update your profile information</p>
          </div> */}

          {/* Profile Card */}
          <div className='bg-white rounded-xl shadow-lg p-8'>
            {/* Profile Image Section */}
            <div className='text-center mb-8'>
              <div className='relative inline-block'>
                <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg mx-auto'>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt='Profile'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40'>
                      <FaUser className='text-4xl text-primary' />
                    </div>
                  )}
                </div>

                {/* Camera Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200'
                >
                  <FaCamera className='text-sm' />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageSelect}
                  className='hidden'
                />
              </div>
              <p className='text-sm text-gray-500 mt-3'>
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* Form Fields */}
            <div className='space-y-4'>
              {/* Name Input */}
              <div className='relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300'></div>
                <div className='relative bg-white border border-gray-200 rounded-2xl p-1 group-focus-within:border-primary/50 group-hover:border-primary/30 transition-all duration-300 shadow-sm group-focus-within:shadow-lg group-focus-within:shadow-primary/10'>
                  <div className='flex items-center px-4 py-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white mr-4 group-focus-within:scale-110 transition-transform duration-300'>
                      <FaUser className='text-sm' />
                    </div>
                    <div className='flex-1'>
                      <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-primary transition-colors duration-300'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        value={profileData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        placeholder='Enter your full name'
                        className='w-full bg-transparent text-lg font-medium text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-0'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className='relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300'></div>
                <div className='relative bg-white border border-gray-200 rounded-2xl p-1 group-focus-within:border-primary/50 group-hover:border-primary/30 transition-all duration-300 shadow-sm group-focus-within:shadow-lg group-focus-within:shadow-primary/10'>
                  <div className='flex items-center px-4 py-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary text-white mr-4 group-focus-within:scale-110 transition-transform duration-300'>
                      <FaLock className='text-sm' />
                    </div>
                    <div className='flex-1'>
                      <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-primary transition-colors duration-300'>
                        New Password
                      </label>
                      <input
                        type='password'
                        value={profileData.password}
                        onChange={e => handleInputChange('password', e.target.value)}
                        placeholder='Enter new password'
                        className='w-full bg-transparent text-lg font-medium text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-0'
                      />
                    </div>
                  </div>
                </div>
                {/* <p className='text-xs text-gray-500 mt-2 ml-14 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300'>
                  Leave empty if you don't want to change your password
                </p> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
              <PrimaryButton
                onClick={handleSave}
                loading={loading}
                className='flex items-center justify-center gap-2 flex-1'
              >
                <FaSave />
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </PrimaryButton>

              <button
                onClick={() => {
                  const userData = getUser();
                  setProfileData({
                    name: userData?.name || '',
                    password: '',
                    profileImage: null,
                  });
                  setImagePreview(userData?.avatar || null);
                }}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 flex-1 sm:flex-none'
              >
                Reset
              </button>
            </div>
          </div>

          {/* Additional Info */}
          {/* <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='flex items-start gap-3'>
              <div className='w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-white text-xs font-bold'>i</span>
              </div>
              <div>
                <h4 className='font-medium text-blue-800 mb-1'>Profile Tips</h4>
                <ul className='text-sm text-blue-700 space-y-1'>
                  <li>• Use a clear, professional profile picture</li>
                  <li>• Choose a strong password with at least 8 characters</li>
                  <li>• Keep your information up to date for better experience</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
