<script lang="ts" setup>
import type { VNode } from 'vue';
import { Status } from '~/components/v1/binding/status/index.vue';
import Languages from '~/core/shared/languages';
import V1Binding from '~/pages/v1/binding/index.vue';

const pages = ref<VNode[]>([]);

onMounted(async () => {
    for (const lang of [Languages.enUS, Languages.zhCN]) {
        for (const status of [Status.SUCCESS, Status.UNVERIFIED, Status.UNKNOWN, Status.UNBIND, Status.ERROR]) {
            document.querySelector('template#data')!.innerHTML = JSON.stringify({
                _lang: lang,
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
    }
});
</script>

<template>
    <div class="flex flex-col p-2 gap-2">
        <template v-for="page in pages">
            <Component :is="page" />
        </template>
    </div>
</template>
