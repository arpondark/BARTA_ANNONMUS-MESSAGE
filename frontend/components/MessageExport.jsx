import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';
import { MessageCard } from './CardTemplates';

const aspectRatios = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '2:1', value: 2 / 1 },
];

const MessageExport = ({ message, templateId }) => {
  const { t, language } = useLanguage();
  const messageCardRef = useRef(null);
  const [aspect, setAspect] = useState(aspectRatios[0].value);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Ensure we have a valid templateId - use the one from message if available and not overridden
  const effectiveTemplateId = templateId || (message && message.cardTemplate) || 'default';

  // Debug log to check template being used
  console.log('MessageExport using template:', {
    providedTemplateId: templateId,
    messageCardTemplate: message && message.cardTemplate,
    effectiveTemplateId
  });

  const downloadAsImage = async () => {
    if (!messageCardRef.current) return;
    try {
      // Log template information for debugging
      console.log('Exporting message with template:', effectiveTemplateId);

      const messageElement = messageCardRef.current;
      messageElement.classList.add('export-rendering');

      // Get computed dimensions to ensure fixed size
      const computedStyle = window.getComputedStyle(messageElement);
      const width = parseInt(computedStyle.width);
      const height = parseInt(computedStyle.height);

      const canvas = await html2canvas(messageElement, {
        backgroundColor: null,
        scale: 3, // Higher quality
        logging: false,
        useCORS: true,
        width: width,
        height: height,
        allowTaint: true,
        foreignObjectRendering: true
      });
      messageElement.classList.remove('export-rendering');
      const image = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `barta-message-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Hide export options after download
      setShowExportOptions(false);
    } catch (error) {
      console.error('Error exporting message:', error);
      alert(language === 'bn' ? 'ছবি হিসাবে সংরক্ষণ করতে সমস্যা হয়েছে।' : 'Problem saving as image.');
    }
  };

  // Fixed dimensions for export
  const width = 640;
  const height = Math.round(width / aspect);

  return (
    <div>
      {!showExportOptions ? (
        <button
          onClick={() => setShowExportOptions(true)}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('exportAsImage') || 'Export as Image'}
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-2xl w-full relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
              onClick={() => setShowExportOptions(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">{t('exportImage') || 'Export Image'}</h3>

            <div className="flex items-center mb-4 gap-2">
              <span className="text-sm text-gray-500">{t('chooseCardRatio') || 'Aspect Ratio'}:</span>
              {aspectRatios.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setAspect(r.value)}
                  className={`px-2 py-1 rounded text-sm border transition-colors ${aspect === r.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-dark-card border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Fixed container - prevents layout shifts */}
            <div className="relative mx-auto" style={{ 
              width: `${width}px`, 
              height: `${height}px`,
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              {/* Inner container with fixed dimensions */}
              <div 
                ref={messageCardRef}
                className="absolute top-0 left-0 right-0 bottom-0 export-container"
                style={{ 
                  width: `${width}px`, 
                  height: `${height}px`
                }}
              >
                <MessageCard
                  message={typeof message === 'object' ? message.content : message}
                  templateId={effectiveTemplateId}
                  className="w-full h-full"
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  publicView={true}
                  showEmoji={true}
                />
                {/* Website logo/title with color */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center z-10">
                  <div className="px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                      বার্তা
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={downloadAsImage}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('saveImage') || 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageExport; 
