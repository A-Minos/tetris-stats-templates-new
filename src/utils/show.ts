import { ref } from 'vue';

export const showSingleplayer = ref(false);

export function confirmShow(): true {
    if (!showSingleplayer.value) {
        showSingleplayer.value = true;
    }
    return true;
}
