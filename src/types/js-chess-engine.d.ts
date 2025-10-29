declare module 'js-chess-engine' {
  export class Game {
    constructor(config?: any);
    aiMove(level?: number): Record<string, string>;
    load(fen: string): void;
    move(from: string, to: string): void;
    exportJson(): any;
  }
}
