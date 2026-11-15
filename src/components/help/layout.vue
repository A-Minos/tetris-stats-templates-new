<template>
    <main id="content" class="help max-w-320 flex flex-col gap-7 px-11 pb-7 pt-10">
        <slot />
    </main>
</template>

<style>
:root,
body {
    margin: 0;
    padding: 0;
    font-size: 16px;
}

@font-face {
    font-family: 'HarmonyOS Sans SC';
    src: url('~/assets/fonts/HarmonyOS_Sans_SC_Medium.ttf');
    font-display: swap;
}

@font-face {
    font-family: CabinetGrotesk;
    src: url('~/assets/fonts/CabinetGrotesk.woff2') format('woff2');
    font-display: swap;
}

.help {
    --help-accent: #f2b544;
    --help-line: rgba(255, 255, 255, 0.07);
    --help-panel: rgba(255, 255, 255, 0.035);
    --help-text-1: rgba(255, 255, 255, 0.92);
    --help-text-2: rgba(255, 255, 255, 0.64);
    --help-text-3: rgba(255, 255, 255, 0.4);
    --help-mono: ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'HarmonyOS Sans SC', monospace;
    --help-display: CabinetGrotesk, 'HarmonyOS Sans SC', sans-serif;

    color: var(--help-text-1);
    font-family: 'HarmonyOS Sans SC', sans-serif;
    line-height: 1.5;
    background-color: #0f1116;
    /* Faint playfield grid: the page itself reads as a Tetris well. */
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 32px 32px;
    background-position: -1px -1px;
}

.help code {
    font-family: var(--help-mono);
}
</style>
