'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  secondName: string;
  avatarUrl: string | null;
  bio: string | null;
  birthday: string | null;
  isPrivate: boolean;
}

const SettingsPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    id: '',
    userId: '',
    firstName: '',
    secondName: '',
    avatarUrl: null,
    bio: '',
    birthday: null,
    isPrivate: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profiles/me');
        const profile: ProfileData = response.data;
        const formattedBirthday = profile.birthday ? profile.birthday.split('T')[0] : null;
        setFormData({ ...profile, birthday: formattedBirthday });
        setAvatarPreview(profile.avatarUrl);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        firstName: formData.firstName,
        secondName: formData.secondName,
        bio: formData.bio,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString() : null,
        isPrivate: formData.isPrivate,
      };

      await api.put('/profiles/me', updateData);

      if (avatarFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('file', avatarFile);
        
        await api.post('/profiles/me/avatar', formDataWithFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/profile/me');
      }, 1500);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      setDeleting(true);
      setError(null);
      await api.delete('/users/me');
      await logout();
    } catch (err) {
      setError('Failed to delete account');
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirm('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="text-gray-600 font-medium">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-500">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-500">Profile Photo</label>
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 relative rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={avatarPreview || '/default-avatar.svg'}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors cursor-pointer w-fit text-gray-500">
                  <Upload className="w-4 h-4" />
                  <span>Change photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-500">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="secondName" className="block text-sm font-semibold text-gray-500">
              Last Name
            </label>
            <input
              type="text"
              id="secondName"
              name="secondName"
              value={formData.secondName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-500">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-500"
              placeholder="Tell us about yourself"
            />
            <p className="text-xs text-gray-500">
              {(formData.bio || '').length}/150
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="birthday" className="block text-sm font-semibold text-gray-500">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-500">
                Private Account
              </span>
            </label>
            <p className="text-xs text-gray-500 ml-7">
              When your account is private, only people you approve can see your posts and profile information.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

          {/* Delete account section */}
          <div className="pt-12 mt-12 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Danger zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, you have 30 days to recover it. After that, your data will be permanently removed.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-full font-semibold hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
        </form>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete account?</h3>
              <p className="text-sm text-gray-600">
                This will schedule your account for deletion. You can recover within 30 days by logging in again.
              </p>
              <p className="text-sm text-gray-600">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm('');
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
