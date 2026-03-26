import type { Component, VNode } from 'vue';

export function useDevPage() {
    const pages = ref<VNode[]>([]);

    async function addPage(data: unknown, component: Component) {
        window.__DATA__ = JSON.stringify(data);
        await nextTick();
        pages.value.push(h(component));
        await nextTick();
    }

    return { pages, addPage };
}
