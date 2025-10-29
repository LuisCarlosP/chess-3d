import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

interface AnimatedGameCameraProps {
  isResetting: boolean;
  actualPlayerColor: 'white' | 'black';
}

export function AnimatedGameCamera({ isResetting, actualPlayerColor }: AnimatedGameCameraProps) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (!camera || !isResetting) return;
    
    const targetZ = actualPlayerColor === 'white' ? 6 : -6;
    const targetY = 9;
    const targetX = 0;
    const startZ = camera.position.z;
    const startY = camera.position.y;
    const startX = camera.position.x;
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      camera.position.x = startX + (targetX - startX) * eased;
      camera.position.y = startY + (targetY - startY) * eased;
      camera.position.z = startZ + (targetZ - startZ) * eased;
      camera.lookAt(0, 0, 0);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [isResetting, camera, actualPlayerColor]);
  
  return null;
}
