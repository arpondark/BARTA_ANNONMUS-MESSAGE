import React, { useRef, useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';
import { templateOptions } from './CardTemplates';
import { CardTemplateSelector, MessageCard, getCardTemplate } from './CardTemplates.tsx';
import { useTheme } from '../context/ThemeContext';

const aspectRatios = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '2:1', value: 2 / 1 },
];

const MessageExport = ({ message, templateId }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const messageCardRef = useRef(null);
  const [aspect, setAspect] = useState(aspectRatios[0].value);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize selected template with the provided templateId or from message
  // Check if the provided templateId exists in templateOptions or custom templates
  const isValidTemplateId = (id) => {
    // First check in templateOptions (from CardTemplates.jsx)
    if (templateOptions && templateOptions.some(template => template.id === id)) {
      return true;
    }
    // Then check using getCardTemplate (from CardTemplates.tsx) which includes custom templates
    try {
      const template = getCardTemplate(id);
      return template && template.id === id;
    } catch (e) {
      return false;
    }
  };

  // Use the provided templateId only if it's valid, otherwise use message.cardTemplate if valid, or 'default'
  const initialTemplateId = isValidTemplateId(templateId) 
    ? templateId 
    : (message && message.cardTemplate && isValidTemplateId(message.cardTemplate) 
      ? message.cardTemplate 
      : 'default');

  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);

  // Debug log to check template being used
  console.log('MessageExport using template:', {
    providedTemplateId: templateId,
    isProvidedTemplateValid: isValidTemplateId(templateId),
    messageCardTemplate: message && message.cardTemplate,
    isMessageTemplateValid: message && message.cardTemplate ? isValidTemplateId(message.cardTemplate) : false,
    initialTemplateId,
    selectedTemplateId
  });

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Fixed downloadAsImage function to properly render templates
  const downloadAsImage = useCallback(async () => {
    if (!messageCardRef.current) return;
    try {
      // Ensure we're using the most current selected template ID
      const currentTemplateId = selectedTemplateId;

      // Log template information for debugging
      let templateName = 'Unknown template';
      const templateFromOptions = templateOptions && templateOptions.find(t => t.id === currentTemplateId);
      if (templateFromOptions) {
        templateName = templateFromOptions.name;
      } else {
        try {
          const template = getCardTemplate(currentTemplateId);
          if (template) {
            templateName = template.name;
          }
        } catch (e) {
          console.error('Error getting template name:', e);
        }
      }

      console.log('Exporting message with template:', {
        selectedTemplateId: currentTemplateId,
        isTemplateValid: isValidTemplateId(currentTemplateId),
        selectedTemplate: templateName
      });

      const messageElement = messageCardRef.current;

      // Add a class for export-specific styling
      messageElement.classList.add('export-rendering');

      // Force any dark mode styles to be applied correctly before capture
      const isDarkMode = theme === 'dark';

      // Ensure the message card is fully visible and rendered
      messageElement.style.opacity = '1';
      messageElement.style.visibility = 'visible';

      // Force all background colors to be explicitly set
      const template = getCardTemplate(currentTemplateId);
      const bgClass = template.background;

      // Extract background color from class if it's a gradient or color class
      let backgroundColor = 'white';
      if (bgClass.includes('bg-gradient')) {
        // For gradients, we'll use a fallback color
        backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
      } else if (bgClass.includes('bg-')) {
        // Try to extract color from Tailwind class
        const colorMatch = bgClass.match(/bg-([a-z]+-[0-9]+|white|black|transparent)/);
        if (colorMatch) {
          const color = colorMatch[1];
          // Map Tailwind color names to actual colors
          const colorMap = {
            'white': '#ffffff',
            'black': '#000000',
            'gray-900': '#111827',
            'gray-800': '#1f2937',
            'gray-50': '#f9fafb',
            // Add more color mappings as needed
          };
          backgroundColor = colorMap[color] || backgroundColor;
        }
      }

      // Force layout recalculation
      messageElement.getBoundingClientRect();

      // Add a longer delay to ensure DOM updates are complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get computed dimensions to ensure fixed size
      const computedStyle = window.getComputedStyle(messageElement);
      const width = parseInt(computedStyle.width);
      const height = parseInt(computedStyle.height);

      // Create a canvas with higher quality settings
      const canvas = await html2canvas(messageElement, {
        backgroundColor: backgroundColor, // Use explicit background color
        scale: 4, // Higher quality for better resolution
        logging: true, // Enable logging for debugging
        useCORS: true,
        width: width,
        height: height,
        allowTaint: true,
        foreignObjectRendering: false, // Changed to false to avoid rendering issues
        imageTimeout: 15000, // Longer timeout for image loading
        onclone: (clonedDoc) => {
          // Additional styling for the cloned document
          const clonedElement = clonedDoc.querySelector('.export-rendering');
          if (clonedElement) {
            // Ensure all styles are applied correctly in the clone
            clonedElement.style.boxShadow = 'none'; // Remove any box shadows for cleaner export

            // Apply explicit background color to ensure it's visible
            if (template.background.includes('bg-gradient')) {
              // For gradients, we need to apply inline styles
              if (template.id === 'gradient-purple') {
                clonedElement.style.background = 'linear-gradient(to right, #a855f7, #ec4899)';
              } else if (template.id === 'gradient-blue') {
                clonedElement.style.background = 'linear-gradient(to right, #60a5fa, #14b8a6)';
              } else if (template.id === 'sunshine') {
                clonedElement.style.background = 'linear-gradient(to right, #fcd34d, #f59e0b)';
              } else if (template.id === 'nature') {
                clonedElement.style.background = 'linear-gradient(to right, #34d399, #10b981)';
              } else if (template.id === 'vibrant-coral') {
                clonedElement.style.background = 'linear-gradient(to right, #fb923c, #ec4899)';
              } else if (template.id === 'midnight-blue') {
                clonedElement.style.background = 'linear-gradient(to right, #1e3a8a, #312e81)';
              } else if (template.id === 'sunset') {
                clonedElement.style.background = 'linear-gradient(to right, #ef4444, #eab308)';
              } else if (template.id === 'sky') {
                clonedElement.style.background = 'linear-gradient(to bottom, #93c5fd, #3b82f6)';
              } else if (template.id === 'galaxy') {
                clonedElement.style.background = 'linear-gradient(to right, #581c87, #4c1d95, #581c87)';
              } else if (template.id === 'forest') {
                clonedElement.style.background = 'linear-gradient(to right, #166534, #064e3b)';
              } else if (template.id === 'beach') {
                clonedElement.style.background = 'linear-gradient(to right, #60a5fa, #fcd34d)';
              } else if (template.id === 'fire') {
                clonedElement.style.background = 'linear-gradient(to right, #dc2626, #ca8a04)';
              } else if (template.id === 'ice') {
                clonedElement.style.background = 'linear-gradient(to right, #dbeafe, #93c5fd)';
              } else {
                // Default gradient
                clonedElement.style.background = backgroundColor;
              }
            } else {
              // For solid colors
              clonedElement.style.backgroundColor = backgroundColor;
            }

            // Force dark mode styles if needed
            if (isDarkMode) {
              clonedDoc.documentElement.classList.add('dark');
            }

            // Make sure all elements are visible
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
            });
          }
        }
      });

      // Remove export-specific class
      messageElement.classList.remove('export-rendering');

      // Convert canvas to image and download
      const image = canvas.toDataURL('image/png', 1.0); // Use maximum quality
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `barta-message-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Hide export options after successful download
      setShowExportOptions(false);
    } catch (error) {
      console.error('Error exporting message:', error);
      alert(language === 'bn' ? 'ছবি হিসাবে সংরক্ষণ করতে সমস্যা হয়েছে।' : 'Problem saving as image.');
    }
  }, [messageCardRef, selectedTemplateId, language, theme]);

  // Function to handle export options - simplified since we removed the dropdown
  const handleExportOption = (option) => {
    if (option === 'export') {
      setShowExportOptions(true);
    } else if (option === 'quickExport') {
      downloadAsImage();
    }
  };

  // Fixed dimensions for export
  const width = 640;
  const height = Math.round(width / aspect);

  // Add CSS for better mobile responsiveness
  useEffect(() => {
    // Add a style tag for custom CSS if it doesn't exist
    if (!document.getElementById('message-export-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'message-export-styles';
      styleTag.innerHTML = `
        /* Desktop styles - ensure card ratio is visible */
        .aspect-ratio-selection {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 1rem;
          gap: 0.5rem;
        }

        .aspect-ratio-label {
          font-weight: 500;
          color: #6b7280;
          margin-right: 0.5rem;
        }

        .aspect-ratio-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .aspect-ratio-container {
          position: relative;
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        /* Ensure aspect ratio is properly displayed on all devices */
        .aspect-ratio-container {
          aspect-ratio: var(--aspect-ratio);
        }

        /* Fix for aspect ratio support in older browsers */
        @supports not (aspect-ratio: 1) {
          .aspect-ratio-container {
            position: relative;
            padding-bottom: calc(100% / var(--aspect-ratio));
          }

          .aspect-ratio-container > * {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }

        /* Export container styling */
        .export-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
        }

        /* Ensure export rendering looks clean */
        .export-rendering {
          box-shadow: none !important;
          border-radius: 12px !important;
          overflow: hidden !important;
        }

        /* Improve visibility of template selection */
        .template-item {
          transition: all 0.2s ease-in-out !important;
        }

        .template-item.selected {
          transform: scale(1.05) !important;
          box-shadow: 0 0 0 2px #4f46e5 !important;
          z-index: 1 !important;
        }

        /* Ensure modal is scrollable on all devices */
        .modal-scrollable {
          max-height: 80vh !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }

        /* Responsive styles for different devices */
        /* Large desktop screens */
        @media (min-width: 1280px) {
          .export-modal {
            padding: 1.5rem !important;
            max-width: 900px !important;
          }

          .aspect-ratio-container {
            max-width: 720px;
          }
        }

        /* Standard desktop screens */
        @media (min-width: 769px) and (max-width: 1279px) {
          .export-modal {
            padding: 1.25rem !important;
          }

          .template-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.75rem !important;
          }
        }

        /* Tablets and small laptops */
        @media (min-width: 641px) and (max-width: 768px) {
          .export-container {
            transform: scale(0.98);
            transform-origin: center center;
          }

          .template-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.75rem !important;
          }

          .export-modal {
            padding: 1rem !important;
            max-height: 90vh !important;
          }
        }

        /* Mobile devices - larger screens (iPhone Plus, Samsung Galaxy) */
        @media (min-width: 481px) and (max-width: 640px) {
          .export-container {
            transform: scale(0.95);
            transform-origin: center center;
          }

          .template-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }

          .export-modal {
            padding: 0.75rem !important;
            margin: 0.5rem !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }

          .export-button {
            padding: 0.5rem 0.75rem !important;
            min-height: 2.5rem !important;
          }

          .dropdown-item {
            padding: 0.75rem 1rem !important;
            min-height: 3rem !important;
          }
        }

        /* Small mobile devices (iPhone SE, smaller Android phones) */
        @media (max-width: 480px) {
          .export-container {
            transform: scale(0.9);
          }

          .template-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.25rem !important;
          }

          .button-group {
            flex-direction: column-reverse !important;
            gap: 0.5rem !important;
          }

          .button-group button {
            width: 100% !important;
          }

          .export-modal {
            padding: 0.5rem !important;
            margin: 0.25rem !important;
          }

          .aspect-ratio-selection {
            flex-direction: column;
            align-items: flex-start;
          }

          .aspect-ratio-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `;
      document.head.appendChild(styleTag);
    }

    return () => {
      // Clean up on unmount
      const styleTag = document.getElementById('message-export-styles');
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Export button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowExportOptions(true)}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors export-button shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="whitespace-nowrap">Export</span>
        </button>
      </div>

      {/* Export options modal - enhanced for all devices */}
      {showExportOptions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dark-card rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-xl md:max-w-2xl relative export-modal modal-scrollable">
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
              onClick={() => setShowExportOptions(false)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">{t('exportImage') || 'Export As Image'}</h3>

            {/* Aspect Ratio Selection - Enhanced for desktop and mobile */}
            <div className="aspect-ratio-selection">
              <span className="aspect-ratio-label text-sm">{t('chooseCardRatio') || 'Aspect Ratio'}:</span>
              <div className="aspect-ratio-buttons">
                {aspectRatios.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setAspect(r.value)}
                    className={`px-2 py-1 rounded text-sm border transition-colors export-button ${aspect === r.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-dark-card border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection - Now more responsive */}
            <div className="mb-4 overflow-x-hidden">
              <CardTemplateSelector
                selectedTemplate={selectedTemplateId}
                onSelect={(templateId) => setSelectedTemplateId(templateId)}
                className="template-grid"
              />
            </div>

            {/* Enhanced responsive container for preview with better aspect ratio support */}
            <div 
              className="aspect-ratio-container" 
              style={{ 
                '--aspect-ratio': aspect
              }}
            >
              {/* Inner container with improved responsive scaling */}
              <div 
                ref={messageCardRef}
                className="export-container"
                style={{ 
                  width: '100%',
                  height: '100%'
                }}
              >
                <MessageCard
                  message={typeof message === 'object' ? message.content : message}
                  templateId={selectedTemplateId}
                  className="w-full h-full"
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.75rem',
                    overflow: 'hidden'
                  }}
                  publicView={true}
                  showEmoji={true}
                />
                {/* Website logo/title with color - bigger and more visible watermark */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center z-10">
                  <div className="px-4 py-2 rounded-full text-lg md:text-xl font-bold flex items-center shadow-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      বার্তা
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons - more responsive */}
            <div className="mt-4 flex flex-wrap justify-end gap-2 button-group">
              <button
                onClick={() => setShowExportOptions(false)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors export-button"
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                onClick={downloadAsImage}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors export-button"
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
