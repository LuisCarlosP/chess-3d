import { IoReload } from 'react-icons/io5';
import { RiLoader4Line } from 'react-icons/ri';

interface ResetModalProps {
  isResetting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetModal({ isResetting, onConfirm, onCancel }: ResetModalProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        minWidth: '350px',
        border: '2px solid #4CAF50'
      }}>
        {isResetting ? (
          <>
            <RiLoader4Line size={60} color="#4CAF50" className="spinning" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '24px' }}>
              Resetting...
            </h2>
            <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>
              Preparing new game
            </p>
          </>
        ) : (
          <>
            <IoReload size={50} color="#4CAF50" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px' }}>
              Are you sure?
            </h2>
            <p style={{ color: '#aaa', margin: '0 0 30px 0', fontSize: '14px' }}>
              Current game progress will be lost
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={onConfirm}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Yes, reset
              </button>
              <button
                onClick={onCancel}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
