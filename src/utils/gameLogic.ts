import type { Piece, PieceType, Position } from '../types';

export function initializeBoard(): Piece[] {
  const pieces: Piece[] = [];
  
  // Peones
  for (let col = 0; col < 8; col++) {
    pieces.push({
      type: 'pawn',
      color: 'white',
      position: { row: 6, col },
      id: `white-pawn-${col}`,
    });
    pieces.push({
      type: 'pawn',
      color: 'black',
      position: { row: 1, col },
      id: `black-pawn-${col}`,
    });
  }

  // Piezas mayores
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  backRow.forEach((type, col) => {
    pieces.push({
      type,
      color: 'white',
      position: { row: 7, col },
      id: `white-${type}-${col}`,
    });
    pieces.push({
      type,
      color: 'black',
      position: { row: 0, col },
      id: `black-${type}-${col}`,
    });
  });

  return pieces;
}

export function isValidMove(
  piece: Piece,
  targetPos: Position,
  pieces: Piece[]
): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  // No puede moverse a la misma posición
  if (fromRow === toRow && fromCol === toCol) {
    return false;
  }

  // No puede capturar sus propias piezas
  const targetPiece = pieces.find(
    p => p.position.row === toRow && p.position.col === toCol
  );

  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  // Validaciones por tipo de pieza
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(piece, targetPos, pieces);
    case 'rook':
      return isValidRookMove(piece, targetPos, pieces);
    case 'knight':
      return isValidKnightMove(piece, targetPos);
    case 'bishop':
      return isValidBishopMove(piece, targetPos, pieces);
    case 'queen':
      return isValidQueenMove(piece, targetPos, pieces);
    case 'king':
      return isValidKingMove(piece, targetPos, pieces);
    default:
      return false;
  }
}

function isValidPawnMove(piece: Piece, targetPos: Position, pieces: Piece[]): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;

  const targetPiece = pieces.find(p => p.position.row === toRow && p.position.col === toCol);

  // Movimiento hacia adelante
  if (fromCol === toCol && !targetPiece) {
    // Un paso adelante
    if (toRow === fromRow + direction) {
      return true;
    }
    // Dos pasos desde posición inicial
    if (fromRow === startRow && toRow === fromRow + 2 * direction) {
      const middleSquare = pieces.find(
        p => p.position.row === fromRow + direction && p.position.col === fromCol
      );
      return !middleSquare;
    }
  }

  // Captura diagonal
  if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && targetPiece) {
    return true;
  }

  return false;
}

function isValidRookMove(piece: Piece, targetPos: Position, pieces: Piece[]): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  // Debe moverse en línea recta (horizontal o vertical)
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  return !isPathBlocked(piece.position, targetPos, pieces);
}

function isValidKnightMove(piece: Piece, targetPos: Position): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(piece: Piece, targetPos: Position, pieces: Piece[]): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  // Debe moverse en diagonal
  if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
    return false;
  }

  return !isPathBlocked(piece.position, targetPos, pieces);
}

function isValidQueenMove(piece: Piece, targetPos: Position, pieces: Piece[]): boolean {
  return isValidRookMove(piece, targetPos, pieces) || isValidBishopMove(piece, targetPos, pieces);
}

function isValidKingMove(piece: Piece, targetPos: Position, pieces: Piece[]): boolean {
  const { row: fromRow, col: fromCol } = piece.position;
  const { row: toRow, col: toCol } = targetPos;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (rowDiff <= 1 && colDiff <= 1) {
    return true;
  }

  if (rowDiff === 0 && colDiff === 2) {
    return isValidCastling(piece, targetPos, pieces);
  }

  return false;
}

function isValidCastling(king: Piece, targetPos: Position, pieces: Piece[]): boolean {
  const { row: kingRow, col: kingCol } = king.position;
  const { col: targetCol } = targetPos;
  
  const baseRow = king.color === 'white' ? 7 : 0;
  
  if (kingRow !== baseRow || kingCol !== 4) {
    return false;
  }

  const isKingSide = targetCol === 6;
  const isQueenSide = targetCol === 2;

  if (!isKingSide && !isQueenSide) {
    return false;
  }

  const rookCol = isKingSide ? 7 : 0;
  const rook = pieces.find(p => 
    p.type === 'rook' && 
    p.color === king.color && 
    p.position.row === baseRow && 
    p.position.col === rookCol
  );

  if (!rook) {
    return false;
  }

  const minCol = Math.min(kingCol, targetCol);
  const maxCol = Math.max(kingCol, targetCol);
  
  for (let col = minCol + 1; col < maxCol; col++) {
    if (pieces.find(p => p.position.row === baseRow && p.position.col === col)) {
      return false;
    }
  }

  if (isQueenSide) {
    if (pieces.find(p => p.position.row === baseRow && p.position.col === 1)) {
      return false;
    }
  }

  return true;
}

export function executeCastling(king: Piece, targetPos: Position, pieces: Piece[]): Piece[] {
  const { row: kingRow } = king.position;
  const { col: targetCol } = targetPos;
  
  const isKingSide = targetCol === 6;
  const rookCol = isKingSide ? 7 : 0;
  const newRookCol = isKingSide ? 5 : 3;

  return pieces.map(p => {
    if (p.id === king.id) {
      return { ...p, position: targetPos };
    }
    if (p.type === 'rook' && p.color === king.color && 
        p.position.row === kingRow && p.position.col === rookCol) {
      return { ...p, position: { row: kingRow, col: newRookCol } };
    }
    return p;
  });
}

function isPathBlocked(from: Position, to: Position, pieces: Piece[]): boolean {
  const { row: fromRow, col: fromCol } = from;
  const { row: toRow, col: toCol } = to;

  const rowStep = toRow === fromRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colStep = toCol === fromCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (pieces.find(p => p.position.row === currentRow && p.position.col === currentCol)) {
      return true;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return false;
}
