import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';
import { MessageCard } from './CardTemplates';

const MessageExport = ({ message, templateId }) => {
  const { t, language } = useLanguage();
  const messageCardRef = useRef(null);

  const downloadAsImage = async () => {
    if (!messageCardRef.current) return;
    
    try {
      const messageElement = messageCardRef.current;
      
      // Add a temporary class for better rendering
      messageElement.classList.add('export-rendering');
      
      const canvas = await html2canvas(messageElement, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      // Remove the temporary class
      messageElement.classList.remove('export-rendering');
      
      // Convert to image
      const image = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `barta-message-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error exporting message:', error);
      alert(language === 'bn' ? 'ছবি হিসাবে সংরক্ষণ করতে সমস্যা হয়েছে।' : 'Problem saving as image.');
    }
  };

  return (
    <div className="mb-4">
      <div 
        ref={messageCardRef} 
        className="relative p-4 bg-white dark:bg-dark-card rounded-lg overflow-hidden"
      >
        <MessageCard 
          message={message.content} 
          templateId={templateId || message.cardTemplate || 'default'}
          className="w-full"
        />
        
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-600">
          বার্তা
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={downloadAsImage}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('saveImage')}
        </button>
      </div>
    </div>
  );
};

export default MessageExport; 