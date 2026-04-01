'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/shared/api';
import { useAuth } from '@/entities/session';
import { useTheme } from '@/application/providers/theme-provider';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

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

const inputClass =
  'w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30';

const SettingsPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
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
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div
          className={cn(
            surface.card,
            'p-8 flex flex-col items-center gap-4 max-w-sm w-full'
          )}
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-foreground font-medium">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="border-b border-border/70">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className={cn(surface.card, animations.slideUp, 'p-5 mb-8 space-y-3 rika-glow-edge')}>
          <h2 className="text-sm font-semibold text-foreground">Оформление</h2>
          <p className="text-xs text-muted-foreground">Как отображать приложение на этом устройстве.</p>
          <div className="flex flex-wrap gap-2">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
                  theme === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                )}
              >
                {t === 'light' ? 'Светлая' : t === 'dark' ? 'Тёмная' : 'Как в системе'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={cn(surface.card, animations.slideUp, 'space-y-6 p-6 sm:p-7 rounded-3xl rika-glow-edge')}>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Profile Photo</label>
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 relative rounded-full bg-muted overflow-hidden border border-border ring-2 ring-primary/20">
                <Image
                  src={avatarPreview || '/default-avatar.svg'}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-full font-semibold hover:bg-muted transition-colors cursor-pointer w-fit text-foreground">
                  <Upload className="w-4 h-4" />
                  <span>Change photo</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="secondName" className="block text-sm font-semibold text-foreground">
              Last Name
            </label>
            <input
              type="text"
              id="secondName"
              name="secondName"
              value={formData.secondName}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              rows={4}
              className={cn(inputClass, 'resize-none')}
              placeholder="Tell us about yourself"
            />
            <p className="text-xs text-muted-foreground">{(formData.bio || '').length}/150</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="birthday" className="block text-sm font-semibold text-foreground">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday || ''}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm font-medium text-foreground">Private Account</span>
            </label>
            <p className="text-xs text-muted-foreground ml-7">
              When your account is private, only people you approve can see your posts and profile information.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl border border-success/30 bg-success-muted/80">
              <p className="text-sm text-success">{success}</p>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-border rounded-full font-semibold hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

          <div className="pt-12 mt-12 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">Danger zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, you have 30 days to recover it. After that, your data will be permanently removed.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-destructive border border-destructive/40 rounded-full font-semibold hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
        </form>

        {showDeleteModal && (
          <div className={modal.root}>
            <button type="button" className={modal.dim} onClick={() => setShowDeleteModal(false)} aria-label="Закрыть" />
            <div className={cn(modal.shell, 'max-w-md p-6 space-y-4')}>
              <h3 className="text-lg font-semibold text-foreground">Delete account?</h3>
              <p className="text-sm text-muted-foreground">
                This will schedule your account for deletion. You can recover within 30 days by logging in again.
              </p>
              <p className="text-sm text-muted-foreground">
                Type <strong className="text-foreground">DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className={cn(inputClass, 'border-destructive/30 focus:ring-destructive/25')}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm('');
                  }}
                  className="flex-1 py-2 border border-border rounded-xl font-semibold hover:bg-muted transition-colors text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                  className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
