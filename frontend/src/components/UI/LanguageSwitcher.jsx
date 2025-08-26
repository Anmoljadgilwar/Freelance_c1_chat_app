import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`text-sm px-2 py-1 rounded ${
          i18n.resolvedLanguage === "en" ? "bg-gray-200" : ""
        }`}
      >
        {t("lang.english")}
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("hi")}
        className={`text-sm px-2 py-1 rounded ${
          i18n.resolvedLanguage === "hi" ? "bg-gray-200" : ""
        }`}
      >
        {t("lang.hindi")}
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`text-sm px-2 py-1 rounded ${
          i18n.resolvedLanguage === "ar" ? "bg-gray-200" : ""
        }`}
      >
        {t("lang.arabic")}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
