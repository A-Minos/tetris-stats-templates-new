export const showSingleplayer = ref(false);

export function confirmShow(): true {
    showSingleplayer.value = true;
    return true;
}
