import type { Piece, Position } from '../types';
import { Game } from 'js-chess-engine';

export class StockfishEngine {
  private engine: any;
  private isReady = false;

  constructor() {
    console.log('🤖 Inicializando motor de ajedrez js-chess-engine...');
    this.initEngine();
  }

  private initEngine() {
    try {
      this.engine = new Game();
      this.isReady = true;
      console.log('✅ Motor de ajedrez cargado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar motor:', error);
      this.isReady = false;
    }
  }

  private positionToNotation(pos: Position): string {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${cols[pos.col]}${8 - pos.row}`;
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
    callback: (move: { from: Position; to: Position }) => void,
    difficulty: number = 10
  ) {
    if (!this.isReady || !this.engine) {
      console.warn('⚠️ Motor no listo');
      return;
    }

    try {
      console.log('🤖 Motor pensando...');
      
      const fen = this.createFEN(pieces, turn);
      this.engine = new Game(fen);
      
      const level = Math.max(1, Math.min(3, Math.floor(difficulty / 7)));
      const aiMove = this.engine.aiMove(level);
      
      const moveKeys = Object.keys(aiMove);
      if (moveKeys.length > 0) {
        const fromNotation = moveKeys[0];
        const toNotation = aiMove[fromNotation];
        
        const from = this.notationToPosition(fromNotation);
        const to = this.notationToPosition(toNotation);
        
        console.log(`✅ Movimiento calculado: ${fromNotation} -> ${toNotation}`);
        callback({ from, to });
      }
    } catch (error) {
      console.error('❌ Error al calcular movimiento:', error);
    }
  }

  public stop() {
    this.isReady = false;
    this.engine = null;
  }
}
