'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import type { Post } from '@/entities/post';
import { updatePost } from '@/entities/post';
import { MentionTextarea } from '@/shared/ui/mention-textarea';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';

interface EditPostModalProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

export function EditPostModal({ post, open, onClose }: EditPostModalProps) {
  const [editDescription, setEditDescription] = useState(post.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [editFileTypes, setEditFileTypes] = useState<('image' | 'video')[]>([]);
  const [editCurrentIndex, setEditCurrentIndex] = useState(0);
  const [editAssetsToDelete, setEditAssetsToDelete] = useState<string[]>([]);
  const [editExistingAssets, setEditExistingAssets] = useState<
    Array<{ id: string; url: string; type?: string }>
  >(
    () =>
      (post.assets || []).map((asset) => ({
        id: (asset as { id?: string }).id ?? asset.url,
        url: asset.url,
        type: asset.type,
      })),
  );

  useEffect(() => {
    if (open) {
      setEditDescription(post.description || '');
      setEditExistingAssets(
        (post.assets || []).map((asset) => ({
          id: (asset as { id?: string }).id ?? asset.url,
          url: asset.url,
          type: asset.type,
        })),
      );
      setEditFiles([]);
      setEditPreviews([]);
      setEditFileTypes([]);
      setEditCurrentIndex(0);
      setEditAssetsToDelete([]);
    }
  }, [open, post.description, post.assets]);

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const MAX_FILES = 10;
    const currentFileCount = editExistingAssets.length - editAssetsToDelete.length + editFiles.length;
    const remainingSlots = MAX_FILES - currentFileCount;

    if (remainingSlots <= 0) {
      alert(`Maximum number of files: ${MAX_FILES}`);
      return;
    }

    const valid: File[] = [];
    const previewsArr: string[] = [];
    const typesArr: ('image' | 'video')[] = [];

    const filesToProcess = selected.slice(0, remainingSlots);
    if (selected.length > remainingSlots) {
      alert(`You can only add ${remainingSlots} file(s). The rest will be ignored.`);
    }

    await Promise.all(
      filesToProcess.map(async (f) => {
        const isVideo = f.type.startsWith('video/');
        const isImage = f.type.startsWith('image/');
        if (!isVideo && !isImage) return;
        valid.push(f);
        typesArr.push(isVideo ? 'video' : 'image');
        previewsArr.push(
          await new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.readAsDataURL(f);
          }),
        );
      }),
    );

    if (valid.length) {
      setEditFiles((prev) => [...prev, ...valid]);
      setEditPreviews((prev) => [...prev, ...previewsArr]);
      setEditFileTypes((prev) => [...prev, ...typesArr]);
      setEditCurrentIndex(editPreviews.length);
    }
  };

  const handleDeleteExistingAsset = (assetId: string) => {
    if (editAssetsToDelete.includes(assetId)) {
      setEditAssetsToDelete((prev) => prev.filter((id) => id !== assetId));
    } else {
      setEditAssetsToDelete((prev) => [...prev, assetId]);
    }
  };

  const handleDeleteNewFile = (index: number) => {
    const nextFiles = [...editFiles];
    const nextPreviews = [...editPreviews];
    const nextTypes = [...editFileTypes];
    nextFiles.splice(index, 1);
    nextPreviews.splice(index, 1);
    nextTypes.splice(index, 1);
    setEditFiles(nextFiles);
    setEditPreviews(nextPreviews);
    setEditFileTypes(nextTypes);
    setEditCurrentIndex((i) => Math.max(0, Math.min(i, nextPreviews.length - 1)));
  };

  const handleClose = () => {
    onClose();
  };

  const handleEditPost = async () => {
    if (isEditing || !post.id) return;

    setIsEditing(true);
    try {
      await updatePost(
        post.id,
        editDescription.trim(),
        editFiles.length > 0 ? editFiles : undefined,
        editAssetsToDelete.length > 0 ? editAssetsToDelete : undefined,
      );
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    } finally {
      setIsEditing(false);
    }
  };

  if (!open) return null;

  return (
    <div className={modal.root}>
      <button type="button" className={modal.dim} onClick={handleClose} aria-label="Закрыть" />
      <div className={cn(modal.shell, 'max-w-2xl max-h-[90vh]')} onClick={(e) => e.stopPropagation()}>
        <div className={modal.header}>
          <h2 className="text-lg font-semibold text-foreground">Edit Post</h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-muted transition">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {editExistingAssets.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Existing Media</h3>
              <div className="grid grid-cols-3 gap-2">
                {editExistingAssets.map((asset) => {
                  const isMarkedForDelete = editAssetsToDelete.includes(asset.id);
                  const isVideo = asset.type === 'VIDEO' || !!asset.url.match(/\.(mp4|webm|ogg|mov)$/i);
                  return (
                    <div
                      key={asset.id}
                      className={`relative aspect-square border-2 rounded-lg overflow-hidden ${
                        isMarkedForDelete ? 'border-red-500 opacity-50' : 'border-border'
                      }`}
                    >
                      {isVideo ? (
                        <video src={asset.url} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        <Image
                          src={asset.url}
                          alt="asset"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 150px"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingAsset(asset.id)}
                        className={`absolute top-1 right-1 p-1 rounded-full text-white text-xs ${
                          isMarkedForDelete ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {isMarkedForDelete ? 'Restore' : 'Delete'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(editPreviews.length > 0 || editExistingAssets.length - editAssetsToDelete.length + editFiles.length < 10) && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">New Media</h3>
              {editPreviews.length > 0 && (
                <div className="border rounded-lg overflow-hidden relative mb-2">
                  {editFileTypes[editCurrentIndex] === 'image' ? (
                    <Image
                      src={editPreviews[editCurrentIndex]}
                      alt={`preview-${editCurrentIndex}`}
                      width={400}
                      height={200}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <video
                      src={editPreviews[editCurrentIndex]}
                      className="w-full h-auto object-contain"
                      controls
                    />
                  )}

                  {editPreviews.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditCurrentIndex((i) => (i - 1 + editPreviews.length) % editPreviews.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditCurrentIndex((i) => (i + 1) % editPreviews.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1"
                      >
                        ›
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteNewFile(editCurrentIndex)}
                    className="absolute top-2 right-2 text-sm text-red-600 bg-card/80 rounded px-2 py-1"
                  >
                    Удалить
                  </button>

                  {editPreviews.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
                      {editPreviews.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditCurrentIndex(idx)}
                          className={`w-2 h-2 rounded-full ${idx === editCurrentIndex ? 'bg-card' : 'bg-card/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleEditFileChange}
                  className="hidden"
                  id="edit-file-upload-fsd"
                  multiple
                  disabled={editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10}
                />
                <label
                  htmlFor="edit-file-upload-fsd"
                  className={cn(
                    'inline-block px-4 py-2 rounded-xl transition-colors font-medium',
                    editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground cursor-pointer hover:opacity-90',
                  )}
                >
                  {editPreviews.length > 0
                    ? `Add More (${editExistingAssets.length - editAssetsToDelete.length + editFiles.length}/10)`
                    : 'Add Files'}
                </label>
                {editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10 && (
                  <p className="text-xs text-muted-foreground mt-2">Maximum 10 files</p>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <MentionTextarea
              value={editDescription}
              onChange={setEditDescription}
              placeholder="Edit post description... (use @ to mention)"
              className="w-full text-sm bg-muted/50 text-foreground placeholder:text-muted-foreground px-3 py-2 rounded-lg border border-border resize-none min-h-[100px] box-border"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end p-4 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-foreground bg-muted hover:bg-muted/80 rounded-xl transition"
            disabled={isEditing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleEditPost}
            disabled={isEditing}
            className="px-4 py-2 text-sm text-primary-foreground bg-primary hover:opacity-90 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
