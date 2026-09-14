import type { Board, Pin } from '@/entities/pin/model/types';

const ASPECTS = [0.75, 1, 1.3, 0.6, 1.5, 0.9];

function seedImage(seed: string, width: number, height: number) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export function generatePins(count: number, offset = 0): Pin[] {
  return Array.from({ length: count }, (_, i) => {
    const index = offset + i;
    const aspect = ASPECTS[index % ASPECTS.length];
    const width = 400;
    const height = Math.round(width / aspect);
    return {
      id: `pin-${index}`,
      imageUrl: seedImage(`pin-${index}`, width, height),
      width,
      height,
      title: PIN_TITLES[index % PIN_TITLES.length],
      authorName: AUTHORS[index % AUTHORS.length],
      boardId: BOARDS[index % BOARDS.length].id,
    };
  });
}

const PIN_TITLES = [
  'Full body mobility flow',
  'Minimalist room ideas',
  'Spread the joy',
  'App onboarding UI',
  'Login screen concept',
  'Cozy reading nook',
  'Weekly workout split',
  'Peanut butter toast recipe',
];

const AUTHORS = ['Unsonmmon', 'SpreadPop', 'Studio Home', 'Alibaba.com', 'FitLife'];

export const BOARDS: Board[] = [
  { id: 'bodybuilding', title: 'Bodybuilding', pinCount: 128, coverImageUrl: seedImage('board-bodybuilding', 400, 500) },
  { id: 'app', title: 'App', pinCount: 64, coverImageUrl: seedImage('board-app', 400, 500) },
  { id: 'login-ui', title: 'Login screen ui', pinCount: 42, coverImageUrl: seedImage('board-login', 400, 500) },
  { id: 'mens-style', title: "Men's style", pinCount: 87, coverImageUrl: seedImage('board-mens', 400, 500) },
  { id: 'home', title: 'Home decor', pinCount: 210, coverImageUrl: seedImage('board-home', 400, 500) },
];

export const CATEGORY_TABS = ['All', ...BOARDS.map((b) => b.title)];
