import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`fab text-primary-foreground border-0 transition-all duration-300 ${
        isPressed ? 'scale-95' : 'hover:scale-110'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <Plus 
        className={`w-6 h-6 transition-transform duration-200 ${
          isPressed ? 'rotate-45' : 'rotate-0'
        }`} 
      />
    </Button>
  );
};

export default FloatingActionButton;