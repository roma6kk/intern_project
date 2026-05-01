'use client';

import React, { useState } from 'react';
import { X, Upload, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import api from '@/shared/api';
import { useAuth } from '@/entities/session';
import { MentionTextarea } from '@/shared/ui/mention-textarea';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';

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

    const MAX_FILES = 10;
    const currentFileCount = files.length;
    const remainingSlots = MAX_FILES - currentFileCount;
    
    if (remainingSlots <= 0) {
      alert(`Максимальное количество файлов: ${MAX_FILES}`);
      return;
    }

    const valid: File[] = [];
    const previewsArr: string[] = [];
    const typesArr: ('image' | 'video')[] = [];

    const filesToProcess = selected.slice(0, remainingSlots);
    if (selected.length > remainingSlots) {
      alert(`Можно добавить только ${remainingSlots} файл(ов). Остальные будут проигнорированы.`);
    }

    await Promise.all(filesToProcess.map(async (f) => {
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
      setCurrentIndex(previews.length);
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

      // Notify feed (and any other listeners) to refresh immediately.
      // This avoids a hard page reload after creating a post.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('post:created'));
      }
      
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
    <div className={modal.root}>
      <button type="button" className={modal.dim} onClick={handleClose} aria-label="Закрыть" />
      <div className={cn(modal.shell, 'max-w-md')}>
        <div className={modal.header}>
          {step === 'caption' && (
            <button type="button" onClick={handleBack} className="p-1 rounded-lg hover:bg-muted text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold mx-auto text-foreground">
            {step === 'upload' ? 'Create new post' : 'Add description'}
          </h2>
          <button type="button" onClick={handleClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={cn(modal.body, 'flex flex-col flex-1 min-h-0')}>
          {step === 'upload' ? (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-muted/30">
                {previews.length > 0 && (
                  <div className="space-y-4">
                    <div className="border border-border rounded-xl overflow-hidden relative bg-muted/50 flex items-center justify-center max-h-[min(55vh,520px)] min-h-[120px]">
                      {fileTypes[currentIndex] === 'image' ? (
                          <Image
                            src={previews[currentIndex]}
                            alt={`preview-${currentIndex}`}
                            width={800}
                            height={800}
                            unoptimized
                            className="w-full h-auto max-h-[min(55vh,520px)] object-contain rounded"
                          />
                      ) : (
                        <video
                          src={previews[currentIndex]}
                          className="w-full max-h-[min(55vh,520px)] object-contain rounded"
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
                      }} className="absolute top-2 right-2 text-sm text-red-600 bg-card/30 rounded px-2">Delete</button>

                      {previews.length > 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
                          {previews.map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-card' : 'bg-card/50'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium text-foreground">Select photo or video</p>
                    <p className="text-sm text-muted-foreground mt-1">или перетащите файл сюда</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    multiple
                    disabled={previews.length >= 10}
                  />
                  <label
                    htmlFor="file-upload"
                    className={cn(
                      'inline-block px-4 py-2 rounded-lg transition-colors font-medium',
                      previews.length >= 10
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground cursor-pointer hover:opacity-90'
                    )}
                  >
                    {previews.length > 0 ? `Add more (${previews.length}/10)` : 'Select file'}
                  </label>
                  {previews.length >= 10 && (
                    <p className="text-sm text-muted-foreground mt-2">Maximum number of files reached (10)</p>
                  )}
                </div>
              </div>
              </div>

              <div className="flex gap-2 pt-4 shrink-0 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={handleSkipUpload}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
              {previews.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden bg-muted/50 flex items-center justify-center max-h-[min(40vh,360px)]">
                  {fileTypes[currentIndex] === 'image' ? (
                    <Image
                      src={previews[currentIndex]}
                      alt={`preview-${currentIndex}`}
                      width={800}
                      height={800}
                      unoptimized
                      className="w-full h-auto max-h-[min(40vh,360px)] object-contain"
                    />
                  ) : (
                    <video
                      src={previews[currentIndex]}
                      className="w-full max-h-[min(40vh,360px)] object-contain"
                      controls
                    />
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 text-foreground">
                <Image
                  src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                  alt={user?.username || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="font-medium">{user?.username || 'User'}</span>
              </div>

              <div>
                <MentionTextarea
                  value={caption}
                  onChange={setCaption}
                  placeholder="Write description... (use @ for mention)"
                  className="w-full h-32 p-3 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-background text-foreground"
                />
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {caption.length}/2200
                </div>
              </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!caption.trim() || isSubmitting}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 mt-4 font-medium"
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
