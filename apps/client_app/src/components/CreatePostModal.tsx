'use client';

import React, { useState } from 'react';
import { X, Upload, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [step, setStep] = useState<'upload' | 'caption'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSkipUpload = () => {
    setStep('caption');
  };

  const handleNextStep = () => {
    if (file || step === 'upload') {
      setStep('caption');
    }
  };

  const handleBack = () => {
    setStep('upload');
  };

  const handleSubmit = async () => {
    if (!caption.trim()) return;
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      if (file) {
        fd.append('files', file);
      }
      fd.append('description', caption);
      
      await api.post('/posts', fd);
      
      // Сброс состояния
      setStep('upload');
      setFile(null);
      setPreview(null);
      setCaption('');
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    setCaption('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          {step === 'caption' && (
            <button onClick={handleBack} className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold mx-auto text-gray-600">
            {step === 'upload' ? 'Создать новый пост' : 'Добавить описание'}
          </h2>
          <button onClick={handleClose} className="p-1">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-4">
          {step === 'upload' ? (
            <div className="space-y-4">
              {/* Загрузка файла */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {preview ? (
                  <div className="space-y-4">
                    <Image 
                      src={preview} 
                      alt="Предпросмотр" 
                      width={192}
                      height={192}
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                    <button 
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Удалить изображение
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-600">Выберите фото или видео</p>
                      <p className="text-sm text-gray-500 mt-1">или перетащите файл сюда</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      Выбрать файл
                    </label>
                  </div>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex gap-2">
                <button
                  onClick={handleSkipUpload}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  Пропустить
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Далее
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Предпросмотр изображения */}
              {preview && (
                <div className="border rounded-lg overflow-hidden">
                  <Image 
                    src={preview} 
                    alt="Предпросмотр" 
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Информация о пользователе */}
              <div className="flex items-center gap-3 text-gray-600">
                <Image
                  src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                  alt={user?.username || 'Пользователь'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="font-medium">{user?.username || 'Пользователь'}</span>
              </div>

              {/* Поле для описания */}
              <div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Напишите описание..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  maxLength={2200}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {caption.length}/2200
                </div>
              </div>

              {/* Кнопка публикации */}
              <button
                onClick={handleSubmit}
                disabled={!caption.trim() || isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
