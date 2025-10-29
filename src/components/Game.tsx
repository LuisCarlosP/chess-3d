import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { GiChessKing, GiChessQueen } from 'react-icons/gi';
import { IoReload, IoShuffle } from 'react-icons/io5';
import { FaRobot, FaUser, FaCircle } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';
import { ChessBoard } from './ChessBoard';
import { ChessPiece } from './ChessPiece';
import { VictoryModal } from './VictoryModal';
import { DefeatModal } from './DefeatModal';
import { ResetModal } from './ResetModal';
import { AnimatedGameCamera } from './AnimatedGameCamera';
import { initializeBoard, isValidMove, executeCastling } from '../utils/gameLogic';
import { ChessEngine } from '../utils/chessEngine';
import type { Piece, Position } from '../types';

export function Game() {
  const [pieces, setPieces] = useState<Piece[]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({
    white: [],
    black: []
  });
  const [vsBot, setVsBot] = useState(true);
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | 'random'>('white');
  const [actualPlayerColor, setActualPlayerColor] = useState<'white' | 'black'>('white');
  const [botDifficulty, setBotDifficulty] = useState(2);
  const [isThinking, setIsThinking] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [gameOver, setGameOver] = useState<'victory' | 'defeat' | null>(null);
  const engineRef = useRef<ChessEngine | null>(null);

  useEffect(() => {
    const chosenColor = playerColor === 'random' 
      ? (Math.random() < 0.5 ? 'white' : 'black')
      : playerColor;
    setActualPlayerColor(chosenColor);
  }, []);

  useEffect(() => {
    if (vsBot) {
      engineRef.current = new ChessEngine();
    }
    
    return () => {
      engineRef.current?.stop();
    };
  }, [vsBot]);

  useEffect(() => {
    if (vsBot && turn !== actualPlayerColor && !isThinking && !gameOver) {
      const botKing = pieces.find(p => p.type === 'king' && p.color === turn);
      if (!botKing) {
        setGameOver('victory');
        setIsThinking(false);
        return;
      }

      setIsThinking(true);
      
      const timeout = setTimeout(() => {
        if (engineRef.current) {
          try {
            const engineDifficulty = botDifficulty === 1 ? 1 : botDifficulty === 2 ? 5 : botDifficulty === 3 ? 10 : 15;
            engineRef.current.getBestMove(pieces, turn, (move) => {
              if (move) {
                makeMove(move.from, move.to);
              } else {
                setGameOver('victory');
              }
              setIsThinking(false);
            }, engineDifficulty);
          } catch (error) {
            setGameOver('victory');
            setIsThinking(false);
          }
        } else {
          setIsThinking(false);
        }
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [turn, vsBot, actualPlayerColor, gameOver]);

  const makeMove = (from: Position, to: Position) => {
    const piece = pieces.find(p => p.position.row === from.row && p.position.col === from.col);
    if (!piece) return;

    const capturedPiece = pieces.find(p => p.position.row === to.row && p.position.col === to.col);

    if (capturedPiece) {
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
      }));
      
      if (capturedPiece.type === 'king') {
        if (vsBot) {
          setGameOver(capturedPiece.color === actualPlayerColor ? 'defeat' : 'victory');
        }
      }
    }

    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      setPieces(prev => executeCastling(piece, to, prev));
    } else {
      setPieces(prev =>
        prev
          .filter(p => !(p.position.row === to.row && p.position.col === to.col))
          .map(p =>
            p.id === piece.id
              ? { ...p, position: to }
              : p
          )
      );
    }
    
    const nextTurn = turn === 'white' ? 'black' : 'white';
    setTurn(nextTurn);
    
    setTimeout(() => {
      setPieces(currentPieces => {
        const opponentKing = currentPieces.find(p => p.type === 'king' && p.color === nextTurn);
        if (!opponentKing) {
          if (vsBot) {
            setGameOver(nextTurn === actualPlayerColor ? 'defeat' : 'victory');
          }
        }
        return currentPieces;
      });
    }, 100);
  };

  const handlePieceClick = (piece: Piece) => {
    if (piece.color !== turn) return;
    if (vsBot && turn !== actualPlayerColor) return;
    if (isThinking) return;
    
    setSelectedPiece(piece);
    
    // Calcular movimientos válidos
    const moves: Position[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(piece, { row, col }, pieces)) {
          moves.push({ row, col });
        }
      }
    }
    setValidMoves(moves);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) return;
    if (isThinking) return;

    const targetPos: Position = { row, col };
    
    if (isValidMove(selectedPiece, targetPos, pieces)) {
      makeMove(selectedPiece.position, targetPos);
    }
    
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const resetGame = () => {
    setPieces(initializeBoard());
    setSelectedPiece(null);
    setTurn('white');
    setValidMoves([]);
    setCapturedPieces({ white: [], black: [] });
    setIsThinking(false);
    setGameOver(null);
  };

  const handlePlayAgain = () => {
    const chosenColor = playerColor === 'random' 
      ? (Math.random() < 0.5 ? 'white' : 'black')
      : playerColor;
    
    setActualPlayerColor(chosenColor);
    setTimeout(() => setIsResetting(true), 50);
    setTimeout(() => {
      resetGame();
      setIsResetting(false);
    }, 800);
  };

  const confirmReset = () => {
    const chosenColor = playerColor === 'random' 
      ? (Math.random() < 0.5 ? 'white' : 'black')
      : playerColor;
    
    setActualPlayerColor(chosenColor);
    setTimeout(() => setIsResetting(true), 50);
    setTimeout(() => {
      resetGame();
      setIsResetting(false);
      setShowResetModal(false);
    }, 800);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <div style={{
        width: '100%',
        height: '100%',
        animation: isResetting ? 'zoomOut 0.5s ease-in-out' : 'none'
      }}>
        <Canvas shadows camera={{ position: [0, 9, actualPlayerColor === 'white' ? 6 : -6], fov: 75 }}>
          <AnimatedGameCamera isResetting={isResetting} actualPlayerColor={actualPlayerColor} />
          <OrbitControls 
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
          />
          
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 15, 5]} 
            intensity={0.9} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-10, 10, -5]} 
          intensity={0.6} 
        />
        <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />
        <hemisphereLight args={['#ffffff', '#222222', 0.3]} />

        <ChessBoard onSquareClick={handleSquareClick} validMoves={validMoves} pieces={pieces} />
        
        {pieces.map(piece => (
          <ChessPiece
            key={piece.id}
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onClick={() => handlePieceClick(piece)}
          />
        ))}

        {/* Plano base */}
        <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0f0f1e" />
        </mesh>
      </Canvas>
      </div>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        minWidth: '250px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GiChessKing size={28} />
          Chess 3D
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={vsBot} 
              onChange={(e) => setVsBot(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <FaRobot size={16} />
            <span>Play vs Bot</span>
          </label>
        </div>

        {vsBot && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <strong>Play as:</strong>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPlayerColor('white')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: playerColor === 'white' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'white' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaCircle size={10} color="#e8d4b0" />
                  <span>White</span>
                </button>
                <button
                  onClick={() => setPlayerColor('black')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: playerColor === 'black' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'black' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaCircle size={10} color="#5c4033" />
                  <span>Black</span>
                </button>
                <button
                  onClick={() => setPlayerColor('random')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: playerColor === 'random' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'random' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <IoShuffle size={14} />
                  <span>Random</span>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <strong>Difficulty: {
                  botDifficulty === 1 ? 'Easy' :
                  botDifficulty === 2 ? 'Medium' :
                  botDifficulty === 3 ? 'Hard' : 'Expert'
                }</strong>
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setBotDifficulty(1)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: botDifficulty === 1 ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: botDifficulty === 1 ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Easy
                </button>
                <button
                  onClick={() => setBotDifficulty(2)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: botDifficulty === 2 ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: botDifficulty === 2 ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Medium
                </button>
                <button
                  onClick={() => setBotDifficulty(3)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: botDifficulty === 3 ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: botDifficulty === 3 ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Hard
                </button>
                <button
                  onClick={() => setBotDifficulty(4)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    background: botDifficulty === 4 ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: botDifficulty === 4 ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Expert
                </button>
              </div>
            </div>
          </>
        )}
        
        <div style={{ fontSize: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>Turn:</strong> 
          {turn === actualPlayerColor ? (
            <>
              <FaUser size={14} />
              <span>{turn === 'white' ? 'White' : 'Black'} (You)</span>
            </>
          ) : (
            <>
              {vsBot ? <FaRobot size={14} /> : <FaUser size={14} />}
              <span>{turn === 'white' ? 'White' : 'Black'} {vsBot ? '(Bot)' : ''}</span>
            </>
          )}
        </div>
        
        {isThinking && (
          <div style={{ fontSize: '14px', color: '#ffff00', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiLoader4Line size={16} className="spinning" />
            Bot thinking...
          </div>
        )}
        
        {selectedPiece && (
          <div style={{ fontSize: '14px', color: '#90ee90', marginBottom: '10px' }}>
            Selected piece: {selectedPiece.type}
          </div>
        )}
        
        <button 
          onClick={() => setShowResetModal(true)}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            fontSize: '14px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <IoReload size={16} />
          Reset Game
        </button>
      </div>

      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        minWidth: '180px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GiChessQueen size={20} />
          Captured
        </h3>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#2a2a2a',
            border: '2px solid #555'
          }} />
          <strong>Black:</strong> {capturedPieces.black.length}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#e8d4b0',
            border: '2px solid #d4b896'
          }} />
          <strong>White:</strong> {capturedPieces.white.length}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '12px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '5px' }}>
          Left click: Select | Drag: Rotate | Scroll: Zoom
        </div>
        <div style={{ fontSize: '10px', color: '#aaa' }}>
          © 2025 Luis Carlos Picado Rojas. All rights reserved.
        </div>
      </div>

      {/* Modal de confirmación de reinicio */}
      {showResetModal && (
        <ResetModal
          isResetting={isResetting}
          onConfirm={confirmReset}
          onCancel={cancelReset}
        />
      )}

      {gameOver === 'victory' && (
        <VictoryModal
          playerColor={playerColor}
          botDifficulty={botDifficulty}
          onPlayerColorChange={setPlayerColor}
          onDifficultyChange={setBotDifficulty}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {/* Modal de Derrota */}
      {gameOver === 'defeat' && (
        <DefeatModal
          playerColor={playerColor}
          botDifficulty={botDifficulty}
          onPlayerColorChange={setPlayerColor}
          onDifficultyChange={setBotDifficulty}
          onTryAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
