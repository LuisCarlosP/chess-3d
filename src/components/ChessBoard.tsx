import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Piece } from '../types';

interface ChessBoardProps {
  onSquareClick: (row: number, col: number) => void;
  validMoves: { row: number; col: number }[];
  pieces: Piece[];
}

export function ChessBoard({ onSquareClick, validMoves, pieces }: ChessBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const hasEnemyPiece = (row: number, col: number) => {
    return pieces.some(piece => piece.position.row === row && piece.position.col === col);
  };

  return (
    <group>
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const isLight = (row + col) % 2 === 0;
          const baseColor = isLight ? '#f0d9b5' : '#b58863';
          const isValid = isValidMove(row, col);
          const isCapture = isValid && hasEnemyPiece(row, col);
          
          return (
            <group key={`${row}-${col}`}>
              <mesh
                position={[col - 3.5, 0, row - 3.5]}
                onClick={() => onSquareClick(row, col)}
                receiveShadow
              >
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              
              {isValid && (
                <ValidMoveIndicator position={[col - 3.5, 0.15, row - 3.5]} isCapture={isCapture} />
              )}
            </group>
          );
        })
      )}
    </group>
  );
}

function ValidMoveIndicator({ position, isCapture }: { position: [number, number, number]; isCapture: boolean }) {
  const meshRef = useRef<any>(null);
  const ringRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.08 + 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current && isCapture) {
      const ringPulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      ringRef.current.scale.set(ringPulse, ringPulse, ringPulse);
    }
  });
  
  if (isCapture) {
    return (
      <group>
        <mesh ref={ringRef} position={[position[0], 0.05, position[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.08, 16, 32]} />
          <meshStandardMaterial
            color="#D32F2F"
            transparent
            opacity={0.95}
            emissive="#C62828"
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh ref={meshRef} position={[position[0], 0.15, position[2]]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#D32F2F"
            transparent
            opacity={0.9}
            emissive="#C62828"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    );
  }
  
  return (
    <mesh ref={meshRef} position={[position[0], position[1] + 0.05, position[2]]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#66BB6A"
        transparent
        opacity={0.7}
        emissive="#4CAF50"
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}
