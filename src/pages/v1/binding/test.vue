<script lang="ts" setup>
import type { VNode } from 'vue';
import V1Binding from '~/pages/v1/binding/index.vue';
import { Status } from '~/types/status';

const { setLocale } = useI18n();

const pages = ref<VNode[]>([]);

onMounted(async () => {
    for (const status of Object.values(Status)) {
        window.__DATA__ = JSON.stringify({
            platform: 'TETR.IO',
            type: status,
            user: {
                avatar: 'https://tetr.io/user-content/avatars/5eb270aaeb7d4250d3f2fc47.jpg',
                name: 'SCDHH',
            },
            bot: {
                avatar: 'https://txt.osk.sh/branding/tetrio-color.png',
                name: 'NoneBot',
            },
            error: '__error__',
            command: '__command__',
        });

        await nextTick();

        const rendered = h(V1Binding);

        pages.value.push(rendered);

        await nextTick();
    }
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <button @click="setLocale('zh-CN')" style="z-index: 999999">zh-CN</button>
        <button @click="setLocale('en-US')" style="z-index: 999999">en-US</button>
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
