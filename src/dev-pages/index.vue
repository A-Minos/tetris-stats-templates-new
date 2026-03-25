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
    <main class="mx-auto max-w-240 p-6">
        <header class="mb-6">
            <h1 class="text-7 font-bold">Dev Preview Pages</h1>
            <p class="mt-2 text-3 text-white/60">
                根据当前已注册的 <code>/dev/**</code> 路由生成目录树，和实际可访问页面保持一致。
            </p>
        </header>

        <n-card size="small">
            <ul class="m-0 list-none p-0">
                <li v-for="item in previewTreeItems" :key="item.key" class="py-1">
                    <div class="flex items-center gap-2" :style="{ paddingLeft: `${item.depth * 1.25}rem` }">
                        <span class="font-mono text-white/40">{{ item.hasChildren ? 'dir' : 'page' }}</span>
                        <NuxtLink
                            v-if="item.routePath"
                            class="font-mono text-sky-300 no-underline hover:underline"
                            :to="item.routePath"
                        >
                            {{ item.label }}
                        </NuxtLink>
                        <code v-else>{{ item.label }}</code>
                        <span v-if="item.routePath" class="font-mono text-white/40">{{ item.routePath }}</span>
                    </div>
                </li>
            </ul>
        </n-card>
    </main>
</template>
