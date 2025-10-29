interface ChessBoardProps {
  onSquareClick: (row: number, col: number) => void;
  validMoves: { row: number; col: number }[];
}

export function ChessBoard({ onSquareClick, validMoves }: ChessBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <group>
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const isLight = (row + col) % 2 === 0;
          const baseColor = isLight ? '#f0d9b5' : '#b58863';
          const isValid = isValidMove(row, col);
          const color = isValid ? '#90ee90' : baseColor;
          
          return (
            <mesh
              key={`${row}-${col}`}
              position={[col - 3.5, 0, row - 3.5]}
              onClick={() => onSquareClick(row, col)}
              receiveShadow
            >
              <boxGeometry args={[1, 0.1, 1]} />
              <meshStandardMaterial 
                color={color}
                emissive={isValid ? '#00ff00' : '#000000'}
                emissiveIntensity={isValid ? 0.2 : 0}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}
