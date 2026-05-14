'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { videoService } from '@/services/videoService';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const videoInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
      <p className="text-4xl mb-3">🔒</p>
      <p className="font-medium">Please log in to upload videos</p>
    </div>
  );

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) return setError('Please select a valid video file');
    if (file.size > 100 * 1024 * 1024) return setError('Video must be less than 100MB');
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError('Please select a video file');
    if (!title.trim()) return setError('Please add a title');

    setLoading(true);
    setError('');
    setUploadProgress('Uploading to cloud storage...');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      setUploadProgress('Processing your video...');
      await videoService.uploadVideo(formData);

      setUploadProgress('Done!');
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-8 pt-8 pb-16">
      <h1 className="text-2xl font-bold mb-8">Upload Video</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">
          {/* Video selector */}
          <div
            onClick={() => videoInputRef.current?.click()}
            className="w-52 h-80 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition bg-gray-50 overflow-hidden"
          >
            {videoPreview ? (
              <video src={videoPreview} className="w-full h-full object-cover" muted />
            ) : (
              <>
                <span className="text-4xl mb-3">📹</span>
                <p className="text-sm font-medium text-gray-600 text-center px-4">
                  Click to select video
                </p>
                <p className="text-xs text-gray-400 mt-1">MP4, MOV up to 100MB</p>
              </>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>

          {/* Form fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title for your video"
                maxLength={100}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video, add hashtags..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Thumbnail{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition"
              />
            </div>

            {/* Upload progress */}
            {uploadProgress && (
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                {uploadProgress}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8 justify-end">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-8 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={loading || !videoFile}
            className="px-8 py-2.5 bg-[#FE2C55] hover:bg-[#e0264c] text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}