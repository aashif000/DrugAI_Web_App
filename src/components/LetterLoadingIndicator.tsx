
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LetterLoadingIndicatorProps {
  letter: string;
}

const LetterLoadingIndicator: React.FC<LetterLoadingIndicatorProps> = ({ letter }) => {
  return (
    <div className="flex items-center justify-center py-6">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
      <span className="text-blue-500">Loading data for letter {letter.toUpperCase()}...</span>
    </div>
  );
};

export default LetterLoadingIndicator;
