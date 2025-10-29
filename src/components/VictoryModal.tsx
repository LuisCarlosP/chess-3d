import { GiChessKing } from 'react-icons/gi';
import { IoReload, IoShuffle } from 'react-icons/io5';
import { FaCircle } from 'react-icons/fa';

interface VictoryModalProps {
  playerColor: 'white' | 'black' | 'random';
  botDifficulty: number;
  onPlayerColorChange: (color: 'white' | 'black' | 'random') => void;
  onDifficultyChange: (difficulty: number) => void;
  onPlayAgain: () => void;
}

export function VictoryModal({
  playerColor,
  botDifficulty,
  onPlayerColorChange,
  onDifficultyChange,
  onPlayAgain
}: VictoryModalProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.5s ease-in-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a4d1a 0%, #2d5f2d 100%)',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 15px 50px rgba(0, 255, 0, 0.3)',
        textAlign: 'center',
        minWidth: '400px',
        border: '3px solid #4CAF50'
      }}>
        <GiChessKing size={80} color="#4CAF50" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ color: '#4CAF50', margin: '0 0 15px 0', fontSize: '36px', fontWeight: 'bold' }}>
          VICTORY!
        </h2>
        <p style={{ color: '#90EE90', margin: '0 0 30px 0', fontSize: '18px' }}>
          You defeated the opponent
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '16px', color: 'white' }}>
            <strong>Next game as:</strong>
          </label>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => onPlayerColorChange('white')}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                background: playerColor === 'white' ? '#4CAF50' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'white' ? '2px solid #4CAF50' : '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FaCircle size={10} color="#e8d4b0" />
              <span>White</span>
            </button>
            <button
              onClick={() => onPlayerColorChange('black')}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                background: playerColor === 'black' ? '#4CAF50' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'black' ? '2px solid #4CAF50' : '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FaCircle size={10} color="#5c4033" />
              <span>Black</span>
            </button>
            <button
              onClick={() => onPlayerColorChange('random')}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                background: playerColor === 'random' ? '#4CAF50' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'random' ? '2px solid #4CAF50' : '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <IoShuffle size={14} />
              <span>Random</span>
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'white' }}>
              <strong>Difficulty: {
                botDifficulty === 1 ? 'Easy' :
                botDifficulty === 2 ? 'Medium' :
                botDifficulty === 3 ? 'Hard' : 'Expert'
              }</strong>
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button
                onClick={() => onDifficultyChange(1)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
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
                onClick={() => onDifficultyChange(2)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
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
                onClick={() => onDifficultyChange(3)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
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
                onClick={() => onDifficultyChange(4)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
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
        </div>

        <button
          onClick={onPlayAgain}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          <IoReload size={20} />
          Play Again
        </button>
      </div>
    </div>
  );
}
