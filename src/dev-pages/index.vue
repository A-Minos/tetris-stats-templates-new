<script lang="ts" setup>
type PreviewTreeNode = {
    key: string;
    label: string;
    routePath: string | null;
    children: PreviewTreeNode[];
};

type PreviewTreeItem = {
    key: string;
    label: string;
    routePath: string | null;
    depth: number;
    hasChildren: boolean;
};

function createNode(key: string, label: string): PreviewTreeNode {
    return {
        key,
        label,
        routePath: null,
        children: [],
    };
}

function flattenTree(nodes: PreviewTreeNode[], depth = 0): PreviewTreeItem[] {
    return nodes.flatMap((node) => [
        {
            key: node.key,
            label: node.label,
            routePath: node.routePath,
            depth,
            hasChildren: node.children.length > 0,
        },
        ...flattenTree(node.children, depth + 1),
    ]);
}

const router = useRouter();

const previewTreeItems = computed<PreviewTreeItem[]>(() => {
    const roots: PreviewTreeNode[] = [];

    for (const route of router
        .getRoutes()
        .filter((entry) => entry.path.startsWith('/dev/') && entry.path !== '/dev')
        .sort((left, right) => left.path.localeCompare(right.path))) {
        const segments = route.path.replace(/^\/dev\//, '').split('/');
        let level = roots;
        let currentPath = '';
        let target: PreviewTreeNode | null = null;

        for (const segment of segments) {
            currentPath = currentPath ? `${currentPath}/${segment}` : segment;

            let node = level.find((entry) => entry.key === currentPath);
            if (!node) {
                node = createNode(currentPath, segment);
                level.push(node);
            }

            target = node;
            level = node.children;
        }

        if (target) {
            target.routePath = route.path;
        }
    }

    return flattenTree(roots);
});
</script>

<template>
    <div class="fixed inset-0 w-full h-full overflow-y-auto bg-[#101014] text-white/80 font-sans">
        <main class="mx-auto max-w-240 p-6 sm:p-10">
            <header class="mb-8 pl-2 sm:pl-4 border-l-4 border-sky-500/50">
                <h1 class="text-3xl font-bold tracking-tight text-white/90 m-0 leading-tight">Dev Preview Pages</h1>
            </header>

            <div class="p-2 sm:p-4 bg-white/5 rounded-xl border border-white/5 shadow-2xl">
                <ul class="m-0 flex flex-col gap-0.5 list-none p-0">
                    <li v-for="item in previewTreeItems" :key="item.key">
                        <div
                            class="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors"
                            :class="item.routePath ? 'cursor-pointer hover:bg-white/10' : ''"
                            :style="{ paddingLeft: `${item.depth * 1.5 + 0.5}rem` }"
                        >
                            <NuxtLink
                                v-if="item.routePath"
                                class="font-mono text-[14px] text-sky-400 no-underline transition-colors hover:text-sky-300"
                                :to="item.routePath"
                            >
                                {{ item.label }}
                            </NuxtLink>
                            <span v-else class="font-mono text-[14px] text-white/40">{{ item.label }}</span>

                            <div
                                class="flex-1 h-0 border-0 border-b border-dashed border-white/20 mx-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            ></div>

                            <span v-if="item.routePath" class="font-mono text-[12px] text-white/30 hidden sm:block">
                                {{ item.routePath }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </main>
    </div>
</template>
