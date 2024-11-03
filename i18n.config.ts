import en_US from './locales/en-US.json';
import zh_CN from './locales/zh-CN.json';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en-US',
    messages: {
        'en-US': en_US,
        'zh-CN': zh_CN,
    },
}));
