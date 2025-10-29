import type { Piece, Position } from '../types';
import { Game } from 'js-chess-engine';

export class ChessEngine {
  private engine: any;
  private isReady = false;

  constructor() {
    this.initEngine();
  }

  private initEngine() {
    try {
      this.engine = new Game();
      this.isReady = true;
    } catch (error) {
      this.isReady = false;
    }
  }

  private notationToPosition(notation: string): Position {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const lowerNotation = notation.toLowerCase();
    const col = cols.indexOf(lowerNotation[0]);
    const row = 8 - parseInt(lowerNotation[1]);
    return { row, col };
  }

  private createFEN(pieces: Piece[], turn: 'white' | 'black'): string {
    const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    pieces.forEach(piece => {
      const symbol = this.pieceToSymbol(piece);
      board[piece.position.row][piece.position.col] = symbol;
    });

    let fen = '';
    for (let row = 0; row < 8; row++) {
      let emptyCount = 0;
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += piece;
        } else {
          emptyCount++;
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if (row < 7) {
        fen += '/';
      }
    }

    const turnChar = turn === 'white' ? 'w' : 'b';
    return `${fen} ${turnChar} KQkq - 0 1`;
  }

  private pieceToSymbol(piece: Piece): string {
    const symbols: Record<string, string> = {
      pawn: 'p',
      rook: 'r',
      knight: 'n',
      bishop: 'b',
      queen: 'q',
      king: 'k'
    };

    const symbol = symbols[piece.type];
    return piece.color === 'white' ? symbol.toUpperCase() : symbol;
  }

  public getBestMove(
    pieces: Piece[],
    turn: 'white' | 'black',
    callback: (move: { from: Position; to: Position } | null) => void,
    difficulty: number = 5
  ) {
    if (!this.isReady || !this.engine) {
      callback(null);
      return;
    }

    try {
      const fen = this.createFEN(pieces, turn);
      this.engine = new Game(fen);
      
      const level = difficulty <= 1 ? 0 : difficulty <= 5 ? 1 : difficulty <= 10 ? 2 : 3;
      const aiMove = this.engine.aiMove(level);
      
      const moveKeys = Object.keys(aiMove);
      if (moveKeys.length > 0) {
        const fromNotation = moveKeys[0];
        const toNotation = aiMove[fromNotation];
        
        const from = this.notationToPosition(fromNotation);
        const to = this.notationToPosition(toNotation);
        
        callback({ from, to });
      } else {
        callback(null);
      }
    } catch (error) {
      callback(null);
      return;
    }
  }

  public stop() {
    this.isReady = false;
    this.engine = null;
  }
}
