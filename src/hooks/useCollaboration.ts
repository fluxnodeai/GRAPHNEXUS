'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  isActive: boolean;
}

interface UserCursor {
  userId: string;
  x: number;
  y: number;
  timestamp: number;
}

interface EditEvent {
  type: string;
  nodeId?: string;
  userId: string;
  timestamp: number;
  data?: any;
}

interface UseCollaborationReturn {
  collaborators: Collaborator[];
  userCursors: UserCursor[];
  broadcastCursor: (x: number, y: number) => void;
  broadcastEdit: (event: EditEvent) => void;
  isCollaborationActive: boolean;
}

export function useCollaboration(graphId: string): UseCollaborationReturn {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [userCursors, setUserCursors] = useState<UserCursor[]>([]);
  const [isCollaborationActive, setIsCollaborationActive] = useState(false);
  const lastBroadcastRef = useRef<number>(0);
  const throttleDelayRef = useRef<number>(100); // 100ms throttle

  // Simulate collaboration in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Simulate some active collaborators
      const mockCollaborators: Collaborator[] = [
        {
          id: 'user_1',
          name: 'Alice Chen',
          avatar: '👩‍💻',
          isActive: true,
          cursor: { x: Math.random() * 800, y: Math.random() * 600 }
        },
        {
          id: 'user_2', 
          name: 'Bob Smith',
          avatar: '👨‍🔬',
          isActive: true,
          cursor: { x: Math.random() * 800, y: Math.random() * 600 }
        }
      ];

      setCollaborators(mockCollaborators);
      setIsCollaborationActive(true);

      // Simulate cursor movements
      const cursorInterval = setInterval(() => {
        setUserCursors(prev => {
          const updated = mockCollaborators.map(collaborator => ({
            userId: collaborator.id,
            x: Math.random() * 800,
            y: Math.random() * 600,
            timestamp: Date.now()
          }));
          return updated;
        });
      }, 3000);

      return () => clearInterval(cursorInterval);
    }
  }, [graphId]);

  // Throttled cursor broadcast
  const broadcastCursor = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastBroadcastRef.current < throttleDelayRef.current) {
      return;
    }
    
    lastBroadcastRef.current = now;
    
    // In development, just log the cursor movement
    if (process.env.NODE_ENV === 'development') {
      console.log('Broadcasting cursor movement:', { x, y, graphId });
    }
    
    // TODO: In production, send cursor data via WebSocket
    // websocket.send(JSON.stringify({
    //   type: 'cursor_move',
    //   graphId,
    //   x,
    //   y,
    //   timestamp: now
    // }));
  }, [graphId]);

  // Broadcast edit events
  const broadcastEdit = useCallback((event: EditEvent) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Broadcasting edit event:', event);
    }
    
    // TODO: In production, send edit event via WebSocket
    // websocket.send(JSON.stringify({
    //   type: 'edit_event',
    //   graphId,
    //   event,
    //   timestamp: Date.now()
    // }));
  }, [graphId]);

  // Clean up old cursor positions
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const fiveSecondsAgo = Date.now() - 5000;
      setUserCursors(prev => 
        prev.filter(cursor => cursor.timestamp > fiveSecondsAgo)
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    collaborators,
    userCursors,
    broadcastCursor,
    broadcastEdit,
    isCollaborationActive
  };
}
