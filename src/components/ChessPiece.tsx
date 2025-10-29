import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import type { Piece } from '../types';

interface ChessPieceProps {
  piece: Piece;
  isSelected: boolean;
  onClick: () => void;
}

export function ChessPiece({ piece, isSelected, onClick }: ChessPieceProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = 0.15 + Math.sin(Date.now() * 0.003) * 0.05;
    }
  });

  const { row, col } = piece.position;
  
  // Colores
  const pieceColor = piece.color === 'white' ? '#e8d4b0' : '#5c4033';
  const accentColor = piece.color === 'white' ? '#e8d4b0' : '#5c4033';
  
  // Altura según tipo de pieza
  const heights: Record<string, number> = {
    pawn: 0.7,
    rook: 0.9,
    knight: 1.0,
    bishop: 1.1,
    queen: 1.2,
    king: 1.3,
  };

  // Forma según tipo de pieza
  const renderPieceGeometry = () => {
    const height = heights[piece.type];
    
    switch (piece.type) {
      case 'pawn':
        return (
          <group>
            {/* Base del peón */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.38, 0.42, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello base */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo del peón */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.28, 0.25, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuello superior */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cabeza del peón */}
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
          </group>
        );
      case 'rook':
        return (
          <group>
            {/* Base de la torre */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.38, 0.42, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello inferior */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.32, 0.36, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo de la torre */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.5, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Anillo superior */}
            <mesh position={[0, 0.78, 0]}>
              <cylinderGeometry args={[0.36, 0.34, 0.08, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Corona de la torre */}
            <mesh position={[0, 0.86, 0]}>
              <cylinderGeometry args={[0.42, 0.36, 0.1, 8]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Almenas (4 esquinas) */}
            {[0, 1, 2, 3].map((i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos(i * Math.PI / 2) * 0.32,
                  0.96,
                  Math.sin(i * Math.PI / 2) * 0.32
                ]}
              >
                <boxGeometry args={[0.18, 0.18, 0.18]} />
                <meshStandardMaterial color={pieceColor} />
              </mesh>
            ))}
          </group>
        );
      case 'knight':
        return (
          <group>
            {/* Base del caballo */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.38, 0.42, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello base */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.32, 0.36, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo del caballo */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.35, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Pecho del caballo */}
            <mesh position={[0, 0.64, 0.08]}>
              <sphereGeometry args={[0.26, 32, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuello - parte inferior */}
            <mesh position={[0, 0.75, 0.16]} rotation={[0.6, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.22, 24]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuello - parte superior */}
            <mesh position={[0, 0.86, 0.28]} rotation={[0.8, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.18, 24]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cráneo del caballo */}
            <mesh position={[0, 0.94, 0.42]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.24, 0.26, 0.32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Frente del caballo */}
            <mesh position={[0, 1.02, 0.52]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.2, 0.16, 0.2]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Hocico del caballo */}
            <mesh position={[0, 0.86, 0.58]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.18, 0.14, 0.22]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Punta del hocico */}
            <mesh position={[0, 0.8, 0.68]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Oreja izquierda */}
            <mesh position={[-0.09, 1.1, 0.46]} rotation={[0.2, -0.4, -0.3]}>
              <coneGeometry args={[0.06, 0.16, 8]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Oreja derecha */}
            <mesh position={[0.09, 1.1, 0.46]} rotation={[0.2, 0.4, 0.3]}>
              <coneGeometry args={[0.06, 0.16, 8]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Crin - mechón 1 */}
            <mesh position={[0, 1.06, 0.38]} rotation={[0.6, 0, 0]}>
              <boxGeometry args={[0.1, 0.18, 0.05]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Crin - mechón 2 */}
            <mesh position={[0, 0.96, 0.3]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.12, 0.16, 0.05]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Mandíbula inferior */}
            <mesh position={[0, 0.78, 0.52]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.14, 0.1, 0.18]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
          </group>
        );
      case 'bishop':
        return (
          <group>
            {/* Base del alfil */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.38, 0.42, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello inferior */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.32, 0.36, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo del alfil */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.32, 0.45, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Anillo decorativo */}
            <mesh position={[0, 0.75, 0]}>
              <torusGeometry args={[0.28, 0.05, 16, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello del alfil */}
            <mesh position={[0, 0.88, 0]}>
              <cylinderGeometry args={[0.18, 0.28, 0.25, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cabeza esférica */}
            <mesh position={[0, 1.05, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Corte diagonal característico */}
            <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.08, 0.28, 0.08]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Punta superior */}
            <mesh position={[0, 1.22, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
          </group>
        );
      case 'queen':
        return (
          <group>
            {/* Base de la reina */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.4, 0.44, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello inferior */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.34, 0.38, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo inferior */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.32, 0.34, 0.35, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Anillo decorativo */}
            <mesh position={[0, 0.65, 0]}>
              <torusGeometry args={[0.3, 0.04, 16, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuerpo superior */}
            <mesh position={[0, 0.82, 0]}>
              <cylinderGeometry args={[0.28, 0.3, 0.3, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuello de la corona */}
            <mesh position={[0, 0.98, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.15, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Base de la corona */}
            <mesh position={[0, 1.08, 0]}>
              <cylinderGeometry args={[0.28, 0.22, 0.12, 8]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Puntas de la corona (8 puntas) */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos(i * Math.PI / 4) * 0.24,
                  1.22,
                  Math.sin(i * Math.PI / 4) * 0.24
                ]}
              >
                <coneGeometry args={[0.08, 0.22, 8]} />
                <meshStandardMaterial color={pieceColor} />
              </mesh>
            ))}
            {/* Esfera central superior */}
            <mesh position={[0, 1.28, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
          </group>
        );
      case 'king':
        return (
          <group>
            {/* Base del rey */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.4, 0.44, 0.15, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuello inferior */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.34, 0.38, 0.12, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuerpo inferior */}
            <mesh position={[0, 0.48, 0]}>
              <cylinderGeometry args={[0.33, 0.34, 0.4, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Anillo decorativo 1 */}
            <mesh position={[0, 0.72, 0]}>
              <torusGeometry args={[0.31, 0.04, 16, 32]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cuerpo superior */}
            <mesh position={[0, 0.92, 0]}>
              <cylinderGeometry args={[0.3, 0.31, 0.35, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Cuello de la corona */}
            <mesh position={[0, 1.12, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.18, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Corona del rey */}
            <mesh position={[0, 1.24, 0]}>
              <cylinderGeometry args={[0.3, 0.24, 0.15, 8]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
            {/* Puntas de corona (4 esquinas) */}
            {[0, 1, 2, 3].map((i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos(i * Math.PI / 2) * 0.22,
                  1.36,
                  Math.sin(i * Math.PI / 2) * 0.22
                ]}
              >
                <boxGeometry args={[0.12, 0.2, 0.12]} />
                <meshStandardMaterial color={pieceColor} />
              </mesh>
            ))}
            {/* Cruz horizontal */}
            <mesh position={[0, 1.48, 0]}>
              <boxGeometry args={[0.35, 0.08, 0.08]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
            {/* Cruz vertical */}
            <mesh position={[0, 1.58, 0]}>
              <boxGeometry args={[0.08, 0.28, 0.08]} />
              <meshStandardMaterial color={accentColor} />
            </mesh>
          </group>
        );
      default:
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.3, 0.4, height, 32]} />
              <meshStandardMaterial color={pieceColor} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={[col - 3.5, isSelected ? 0.15 : 0.05, row - 3.5]}
      rotation={[0, piece.color === 'white' ? Math.PI : 0, 0]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
      castShadow
    >
      {renderPieceGeometry()}
      {isSelected && (
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
          <meshStandardMaterial 
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}
