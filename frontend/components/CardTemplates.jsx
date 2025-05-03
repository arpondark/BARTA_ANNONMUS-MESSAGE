import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Helper: fancy font families
const fancyFonts = [
  '"Playfair Display", serif',
  '"Montserrat", sans-serif',
  '"Lora", serif',
  '"Oswald", sans-serif',
  '"Merriweather", serif',
  '"Poppins", sans-serif',
  '"Raleway", sans-serif',
  '"Abril Fatface", cursive',
  '"Pacifico", cursive',
  '"Dancing Script", cursive',
  '"Quicksand", sans-serif',
  '"Lato", sans-serif',
  '"Amatic SC", cursive',
  '"Roboto Slab", serif',
  '"Cormorant Garamond", serif',
  '"Fira Sans", sans-serif',
  '"Playfair Display SC", serif',
  '"Crimson Text", serif',
  '"Work Sans", sans-serif',
  '"Satisfy", cursive',
];

// Helper: get font for template
const getFont = (id, publicView) => {
  if (publicView) {
    return fancyFonts[(id.length * 3) % fancyFonts.length];
  }
  return '"Inter", "Segoe UI", Arial, sans-serif';
};

// Helper: get background for template with high-quality letter backgrounds
const getBackground = (id) => {
  switch (id) {
    // Elegant Minimal Backgrounds
    case 'gradient1':
      return 'url(https://images.unsplash.com/photo-1581431886211-6b932f8367f2?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'gradient2':
      return 'url(https://images.unsplash.com/photo-1579187707643-35646d22b596?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'gradient3':
      return 'url(https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'gradient4':
      return 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'gradient5':
      return 'url(https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    
    // Nature & Organic Textures
    case 'pattern1':
      return 'url(https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'pattern2':
      return 'url(https://images.unsplash.com/photo-1490077476659-095159692ab5?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'pattern3':
      return 'url(https://images.unsplash.com/photo-1483232539664-d89822fb5d3e?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'pattern4':
      return 'url(https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'pattern5':
      return 'url(https://images.unsplash.com/photo-1541140134513-85a161dc4a00?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    
    // Artistic & Abstract Designs
    case 'special1':
      return 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'special2':
      return 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'special3':
      return 'url(https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'special4':
      return 'url(https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'special5':
      return 'url(https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    
    // Premium Aesthetic Designs
    case 'premium1':
      return 'url(https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'premium2':
      return 'url(https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'premium3':
      return 'url(https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'premium4':
      return 'url(https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    case 'premium5':
      return 'url(https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
    
    // Default elegant background
    default:
      return 'url(https://images.unsplash.com/photo-1554147090-e1221a04a025?auto=format&fit=crop&w=800&q=80) center/cover no-repeat';
  }
};

// Helper: get overlay for templates
const getOverlay = (id) => {
  // Customize overlay based on template type
  if (id.startsWith('gradient')) {
    return 'linear-gradient(120deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))';
  } else if (id.startsWith('pattern')) {
    return 'linear-gradient(120deg, rgba(255,255,255,0.8), rgba(255,255,255,0.7))';
  } else if (id.startsWith('special')) {
    return 'linear-gradient(120deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1))';
  } else if (id.startsWith('premium')) {
    return 'linear-gradient(120deg, rgba(43,43,43,0.5), rgba(43,43,43,0.3))';
  }
  return 'linear-gradient(120deg, rgba(255,255,255,0.8), rgba(255,255,255,0.7))';
};

// Helper: get text color based on template
const getTextColor = (id) => {
  if (id.startsWith('pattern')) {
    return '#333';
  }
  return '#fff';
};

// Helper: get text shadow based on template
const getTextShadow = (id) => {
  if (id.startsWith('pattern')) {
    return 'none';
  }
  return '0 2px 5px rgba(0,0,0,0.3)';
};

// Template component that uses all helpers
export function MessageCard({ message, templateId = 'default', className = '', publicView = false, style = {} }) {
  const { language } = useLanguage();
  const fontFamily = getFont(templateId, publicView);
  const background = getBackground(templateId);
  const overlay = getOverlay(templateId);
  const textColor = getTextColor(templateId);
  const textShadow = getTextShadow(templateId);
  
  return (
    <div
      className={`relative rounded-2xl shadow-xl flex items-center justify-center text-center overflow-hidden ${className}`}
      style={{
        ...style,
        background,
        fontFamily,
        position: 'relative',
      }}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0" 
        style={{ background: overlay }}
      ></div>
      
      {/* Message content */}
      <div className="relative z-10 px-8 py-6 w-full">
        <p 
          className="font-medium" 
          style={{ 
            color: textColor, 
            textShadow,
            fontSize: publicView ? '1.4rem' : '1.2rem',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
        
        {/* Brand watermark */}
        <div 
          className="absolute bottom-2 right-3 text-xs opacity-60"
          style={{ color: textColor, textShadow }}
        >
          বার্তা
        </div>
      </div>
    </div>
  );
}

// Export template mapping for dropdown options
export const templateOptions = [
  { id: 'default', name: 'Default' },
  { id: 'gradient1', name: 'Abstract Waves' },
  { id: 'gradient2', name: 'Pastel Dream' },
  { id: 'gradient3', name: 'Gradient Flow' },
  { id: 'gradient4', name: 'Aurora' },
  { id: 'gradient5', name: 'Neon Space' },
  { id: 'pattern1', name: 'Botanical' },
  { id: 'pattern2', name: 'Floral Elegance' },
  { id: 'pattern3', name: 'Natural Texture' },
  { id: 'pattern4', name: 'Marble Story' },
  { id: 'pattern5', name: 'Paper Texture' },
  { id: 'special1', name: 'Artistic Splash' },
  { id: 'special2', name: 'Coastal Vibes' },
  { id: 'special3', name: 'Geometric Art' },
  { id: 'special4', name: 'Watercolor' },
  { id: 'special5', name: 'Abstract Lines' },
  { id: 'premium1', name: 'Night Sky' },
  { id: 'premium2', name: 'Liquid Art' },
  { id: 'premium3', name: 'Golden Hour' },
  { id: 'premium4', name: 'Cosmic Gradient' },
  { id: 'premium5', name: 'Neon Flow' },
];

export function getCardTemplate(id) {
  return templateOptions.find(template => template.id === id) || templateOptions[0];
}