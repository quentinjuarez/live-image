import en from "./en.json";
import fr from "./fr.json";

type TranslationData = {
  locale: "fr" | "en";
  messages: { fr: typeof fr; en: typeof en };
};

const i18n = reactive<TranslationData>({
  locale: "en",
  messages: {
    en,
    fr,
  },
});

export const setLocale = (locale: string) => {
  i18n.locale = locale as "en" | "fr";
};

export const t = (path: string) => {
  const messages = i18n.messages[i18n.locale];

  const findTranslation = (
    keys: string[],
    translations: any
  ): string | undefined => {
    const key = keys.shift();

    if (key === undefined) {
      return undefined;
    }

    const translation = translations[key];

    if (translation === undefined) {
      return undefined;
    }

    if (keys.length === 0) {
      return translation;
    }

    if (typeof translation !== "object") {
      return undefined;
    }

    return findTranslation(keys, translation);
  };

  const keys = path.split(".");
  const translation = findTranslation(keys, messages);

  return translation !== undefined ? translation : path;
};

export default i18n;
