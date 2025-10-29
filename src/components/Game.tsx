import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { GiChessKing, GiChessQueen } from 'react-icons/gi';
import { IoReload, IoShuffle } from 'react-icons/io5';
import { FaRobot, FaUser, FaCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
  const [showControls, setShowControls] = useState(true);
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
        top: '10px',
        left: '10px',
        right: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {/* Panel principal */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          maxWidth: '320px',
          pointerEvents: 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              <GiChessKing size={22} />
              Chess 3D
            </h2>
            <button
              onClick={() => setShowControls(!showControls)}
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid #4CAF50',
                borderRadius: '5px',
                color: '#4CAF50',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
            >
              {showControls ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              {showControls ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Turno siempre visible */}
          <div style={{ fontSize: '14px', marginBottom: showControls ? '8px' : '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <strong>Turn:</strong> 
            {turn === actualPlayerColor ? (
              <>
                <FaUser size={12} />
                <span>{turn === 'white' ? 'White' : 'Black'} (You)</span>
              </>
            ) : (
              <>
                {vsBot ? <FaRobot size={12} /> : <FaUser size={12} />}
                <span>{turn === 'white' ? 'White' : 'Black'} {vsBot ? '(Bot)' : ''}</span>
              </>
            )}
          </div>

        {showControls && (
          <>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={vsBot} 
              onChange={(e) => setVsBot(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <FaRobot size={14} />
            <span>Play vs Bot</span>
          </label>
        </div>

        {vsBot && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                <strong>Play as:</strong>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setPlayerColor('white')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '12px',
                    background: playerColor === 'white' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'white' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaCircle size={8} color="#e8d4b0" />
                  <span>White</span>
                </button>
                <button
                  onClick={() => setPlayerColor('black')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '12px',
                    background: playerColor === 'black' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'black' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaCircle size={8} color="#5c4033" />
                  <span>Black</span>
                </button>
                <button
                  onClick={() => setPlayerColor('random')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '12px',
                    background: playerColor === 'random' ? '#4CAF50' : '#2a2a2a',
                    color: 'white',
                    border: playerColor === 'random' ? '2px solid #4CAF50' : '1px solid #555',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <IoShuffle size={12} />
                  <span>Random</span>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                <strong>Difficulty: {
                  botDifficulty === 1 ? 'Easy' :
                  botDifficulty === 2 ? 'Medium' :
                  botDifficulty === 3 ? 'Hard' : 'Expert'
                }</strong>
              </label>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setBotDifficulty(1)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '11px',
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
                    padding: '8px 4px',
                    fontSize: '11px',
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
                    padding: '8px 4px',
                    fontSize: '11px',
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
                    padding: '8px 4px',
                    fontSize: '11px',
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
        
        {isThinking && showControls && (
          <div style={{ fontSize: '13px', color: '#ffff00', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RiLoader4Line size={14} className="spinning" />
            Bot thinking...
          </div>
        )}
        
        {selectedPiece && showControls && (
          <div style={{ fontSize: '13px', color: '#90ee90', marginBottom: '8px' }}>
            Selected piece: {selectedPiece.type}
          </div>
        )}
        
        {showControls && (
          <>
        <button 
          onClick={() => setShowResetModal(true)}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            fontSize: '13px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <IoReload size={14} />
          Reset Game
        </button>
        </>
        )}
        </div>

        {/* Panel de capturas */}
        {showControls && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          maxWidth: '320px',
          pointerEvents: 'auto'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GiChessQueen size={18} />
            Captured
          </h3>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#2a2a2a',
              border: '2px solid #555'
            }} />
            <strong>Black:</strong> {capturedPieces.black.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#e8d4b0',
              border: '2px solid #d4b896'
            }} />
            <strong>White:</strong> {capturedPieces.white.length}
          </div>
        </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '11px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '8px 15px',
        borderRadius: '5px',
        textAlign: 'center',
        maxWidth: 'calc(100vw - 20px)'
      }}>
        <div style={{ marginBottom: '4px' }}>
          Left click: Select | Drag: Rotate | Scroll: Zoom
        </div>
        <div style={{ fontSize: '9px', color: '#aaa' }}>
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
