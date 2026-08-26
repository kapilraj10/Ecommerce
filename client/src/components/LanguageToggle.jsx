import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggle = () => {
    const newLang = currentLang === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
      title="Switch language"
    >
      <FiGlobe className="h-4 w-4" />
      {currentLang === 'en' ? 'नेपाली' : 'English'}
    </button>
  );
};

export default LanguageToggle;
