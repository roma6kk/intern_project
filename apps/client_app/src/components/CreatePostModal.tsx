'use client';

import React, { useState } from 'react';
import { X, Upload, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import MentionTextarea from './MentionTextarea';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [step, setStep] = useState<'upload' | 'caption'>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<('image' | 'video')[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const valid: File[] = [];
    const previewsArr: string[] = [];
    const typesArr: ('image' | 'video')[] = [];

    await Promise.all(selected.map(async (f) => {
      const isVideo = f.type.startsWith('video/');
      const isImage = f.type.startsWith('image/');
      if (!isVideo && !isImage) return;
      valid.push(f);
      typesArr.push(isVideo ? 'video' : 'image');
      previewsArr.push(await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(f);
      }));
    }));

    if (valid.length) {
      setFiles(prev => [...prev, ...valid]);
      setPreviews(prev => [...prev, ...previewsArr]);
      setFileTypes(prev => [...prev, ...typesArr]);
      setCurrentIndex(previews.length); // jump to first newly added
    }
  };

  const handleSkipUpload = () => {
    setStep('caption');
  };

  const handleNextStep = () => {
    if (files.length > 0 || step === 'upload') {
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
      files.forEach((f) => fd.append('files', f));
      fd.append('description', caption);
      
      await api.post('/posts', fd);
      
      // Сброс состояния
      setStep('upload');
      setFiles([]);
      setPreviews([]);
      setFileTypes([]);
      setCurrentIndex(0);
      setCaption('');
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFiles([]);
    setPreviews([]);
    setFileTypes([]);
    setCurrentIndex(0);
    setCaption('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
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

        <div className="p-4">
          {step === 'upload' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {previews.length > 0 && (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden relative">
                      {fileTypes[currentIndex] === 'image' ? (
                          <Image
                            src={previews[currentIndex]}
                            alt={`preview-${currentIndex}`}
                            width={192}
                            height={192}
                            className="w-full h-auto object-contain rounded"
                          />
                      ) : (
                        <video
                          src={previews[currentIndex]}
                          className="w-full h-auto object-contain rounded"
                          controls
                        />
                      )}

                      {previews.length > 1 && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => (i - 1 + previews.length) % previews.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1">‹</button>
                          <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => (i + 1) % previews.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1">›</button>
                        </>
                      )}

                      <button onClick={() => {
                        const nextFiles = [...files];
                        const nextPreviews = [...previews];
                        const nextTypes = [...fileTypes];
                        nextFiles.splice(currentIndex, 1);
                        nextPreviews.splice(currentIndex, 1);
                        nextTypes.splice(currentIndex, 1);
                        setFiles(nextFiles);
                        setPreviews(nextPreviews);
                        setFileTypes(nextTypes);
                        setCurrentIndex(i => Math.max(0, Math.min(i, nextPreviews.length - 1)));
                      }} className="absolute top-2 right-2 text-sm text-red-600 bg-white/30 rounded px-2">Удалить</button>

                      {previews.length > 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
                          {previews.map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
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
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {previews.length > 0 ? 'Добавить ещё' : 'Выбрать файл'}
                  </label>
                </div>
              </div>

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
              {previews.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  {fileTypes[currentIndex] === 'image' ? (
                    <Image
                      src={previews[currentIndex]}
                      alt={`preview-${currentIndex}`}
                      width={400}
                      height={192}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <video
                      src={previews[currentIndex]}
                      className="w-full h-auto object-contain"
                      controls
                    />
                  )}
                </div>
              )}

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

              <div>
                <MentionTextarea
                  value={caption}
                  onChange={setCaption}
                  placeholder="Напишите описание... (используйте @ для упоминания)"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {caption.length}/2200
                </div>
              </div>

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
