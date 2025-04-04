import en_US from './en-US.json';
import zh_CN from './zh-CN.json';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en-US',
    messages: {
        'en-US': en_US,
        'zh-CN': zh_CN,
    },
}));
