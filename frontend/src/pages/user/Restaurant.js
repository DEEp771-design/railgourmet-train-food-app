import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
export default function Restaurant() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b p-6">
        <Button onClick={() => navigate('/user')} variant="ghost">Back</Button>
      </nav>
      <div className="p-12"><h1 className="text-3xl font-bold">Restaurant - Coming Soon</h1></div>
    </div>
  );
}
