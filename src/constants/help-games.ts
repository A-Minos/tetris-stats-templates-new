import type { TetrominoShape } from '~/components/shared/tetromino.vue';
import tetrioLogo from '~/assets/images/logo/tetrio.svg';
import topLogo from '~/assets/images/logo/top.svg';

export const helpGames: Record<string, { shape: TetrominoShape; logo?: string }> = {
    'TETR.IO': { shape: 'T', logo: tetrioLogo },
    TOP: { shape: 'J', logo: topLogo },
    TOS: { shape: 'L' },
};
