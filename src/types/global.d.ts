import type { ComposerTranslation } from 'vue-i18n';

export {};

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: ComposerTranslation;
    }
}

declare global {
    interface Window {
        __DATA__: string;
    }
}
