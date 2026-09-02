const Languages = ['zh-CN', 'zh-TW', 'en-US', 'es-ES', 'ja-JP', 'ko-KR'] as const;

export type Language = (typeof Languages)[number];

export const languageNames: Record<Language, string> = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English (US)',
    'es-ES': 'Español (España)',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
};

export default Languages;
