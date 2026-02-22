import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
export default function CommentModeration() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-slate-800 p-6">
        <Button onClick={() => navigate('/admin')} variant="ghost">Back to Dashboard</Button>
      </nav>
      <div className="p-12"><h1 className="text-3xl font-bold">Comment Moderation - Coming Soon</h1></div>
    </div>
  );
}
