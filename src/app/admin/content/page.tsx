'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
}

export default function ContentManagement() {
  const [contents, setContents] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(null);
  const [newContent, setNewContent] = useState({
    key: '',
    title: '',
    content: '',
    contentType: 'html',
    sortOrder: 0
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      const data = await ApiClient.getContent();
      setContents(data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (content: ContentBlock) => {
    try {
      await ApiClient.updateContent(content);
      await loadContents();
      setEditingContent(null);
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Failed to update content:', error);
      alert('Failed to update content');
    }
  };

  const handleCreateContent = async () => {
    try {
      await ApiClient.createContent(newContent);
      await loadContents();
      setNewContent({ key: '', title: '', content: '', contentType: 'html', sortOrder: 0 });
      setShowNewForm(false);
      alert('Content created successfully!');
    } catch (error) {
      console.error('Failed to create content:', error);
      alert('Failed to create content');
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return;
    
    try {
      await ApiClient.deleteContent(id);
      await loadContents();
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content');
    }
  };

  if (loading) {
    return <div className="p-8">Loading content management...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-[#0c372b] text-white px-4 py-2 rounded-md hover:bg-[#0a2d22] transition-colors"
        >
          {showNewForm ? 'Cancel' : 'Add New Content'}
        </button>
      </div>

      {/* New Content Form */}
      {showNewForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Content Block</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Key (unique identifier)
              </label>
              <input
                type="text"
                value={newContent.key}
                onChange={(e) => setNewContent({...newContent, key: e.target.value})}
                placeholder="e.g., home_hero_text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                placeholder="Content Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={newContent.contentType}
                onChange={(e) => setNewContent({...newContent, contentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
              >
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
                <option value="text">Plain Text</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={newContent.sortOrder}
                onChange={(e) => setNewContent({...newContent, sortOrder: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={newContent.content}
              onChange={(e) => setNewContent({...newContent, content: e.target.value})}
              rows={6}
              placeholder="Enter your content here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreateContent}
              className="bg-[#0c372b] text-white px-4 py-2 rounded-md hover:bg-[#0a2d22] transition-colors"
            >
              Create Content
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        {contents.map((content) => (
          <div key={content.id} className="bg-white rounded-lg shadow-md">
            {editingContent?.id === content.id ? (
              // Edit Mode
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingContent.title}
                      onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={editingContent.contentType}
                      onChange={(e) => setEditingContent({...editingContent, contentType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
                    >
                      <option value="html">HTML</option>
                      <option value="markdown">Markdown</option>
                      <option value="text">Plain Text</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={editingContent.content}
                    onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0c372b] focus:border-[#0c372b]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveContent(editingContent)}
                    className="bg-[#0c372b] text-white px-4 py-2 rounded-md hover:bg-[#0a2d22] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingContent(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{content.title}</h3>
                    <p className="text-sm text-gray-500">Key: {content.key} | Type: {content.contentType}</p>
                    <p className="text-xs text-gray-400">Last updated: {new Date(content.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingContent(content)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded border max-h-48 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{content.content}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {contents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No content blocks found. Create your first content block to get started!
        </div>
      )}
    </div>
  );
}