import { GiChessQueen } from 'react-icons/gi';
import { IoReload, IoShuffle } from 'react-icons/io5';
import { FaCircle } from 'react-icons/fa';

interface DefeatModalProps {
  playerColor: 'white' | 'black' | 'random';
  botDifficulty: number;
  onPlayerColorChange: (color: 'white' | 'black' | 'random') => void;
  onDifficultyChange: (difficulty: number) => void;
  onTryAgain: () => void;
}

export function DefeatModal({
  playerColor,
  botDifficulty,
  onPlayerColorChange,
  onDifficultyChange,
  onTryAgain
}: DefeatModalProps) {
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
        background: 'linear-gradient(135deg, #4d1a1a 0%, #5f2d2d 100%)',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 15px 50px rgba(255, 0, 0, 0.3)',
        textAlign: 'center',
        minWidth: '400px',
        border: '3px solid #f44336'
      }}>
        <GiChessQueen size={80} color="#f44336" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ color: '#f44336', margin: '0 0 15px 0', fontSize: '36px', fontWeight: 'bold' }}>
          DEFEAT
        </h2>
        <p style={{ color: '#ff9999', margin: '0 0 30px 0', fontSize: '18px' }}>
          The opponent won the game
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
                background: playerColor === 'white' ? '#f44336' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'white' ? '2px solid #f44336' : '1px solid #555',
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
                background: playerColor === 'black' ? '#f44336' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'black' ? '2px solid #f44336' : '1px solid #555',
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
                background: playerColor === 'random' ? '#f44336' : '#2a2a2a',
                color: 'white',
                border: playerColor === 'random' ? '2px solid #f44336' : '1px solid #555',
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
                  background: botDifficulty === 1 ? '#f44336' : '#2a2a2a',
                  color: 'white',
                  border: botDifficulty === 1 ? '2px solid #f44336' : '1px solid #555',
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
                  background: botDifficulty === 2 ? '#f44336' : '#2a2a2a',
                  color: 'white',
                  border: botDifficulty === 2 ? '2px solid #f44336' : '1px solid #555',
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
                  background: botDifficulty === 3 ? '#f44336' : '#2a2a2a',
                  color: 'white',
                  border: botDifficulty === 3 ? '2px solid #f44336' : '1px solid #555',
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
                  background: botDifficulty === 4 ? '#f44336' : '#2a2a2a',
                  color: 'white',
                  border: botDifficulty === 4 ? '2px solid #f44336' : '1px solid #555',
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
          onClick={onTryAgain}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: '#f44336',
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
          Try Again
        </button>
      </div>
    </div>
  );
}
