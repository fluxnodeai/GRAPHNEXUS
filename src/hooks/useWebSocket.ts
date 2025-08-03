'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketReturn {
  isConnected: boolean;
  connectedUsers: number;
  sendMessage: (message: string) => void;
  lastMessage: string | null;
  error: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    try {
      // In development, simulate WebSocket connection
      if (process.env.NODE_ENV === 'development') {
        console.log('Simulating WebSocket connection to:', url);
        setIsConnected(true);
        setConnectedUsers(Math.floor(Math.random() * 5) + 1);
        setError(null);
        
        // Simulate periodic messages
        const interval = setInterval(() => {
          if (Math.random() > 0.8) {
            setLastMessage(JSON.stringify({
              type: 'user_update',
              data: { userCount: Math.floor(Math.random() * 5) + 1 },
              timestamp: Date.now()
            }));
          }
        }, 5000);

        return interval;
      }

      // Real WebSocket connection for production
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event.data);
        
        // Parse message to update user count
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'user_count') {
            setConnectedUsers(message.count || 1);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setIsConnected(false);
      };

      return null; // Return null for production WebSocket
    } catch (e) {
      console.error('Failed to create WebSocket connection:', e);
      setError('Failed to connect');
      return null;
    }
  }, [url]);

  useEffect(() => {
    const result = connect();

    return () => {
      if (result) {
        clearInterval(result);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Simulated message sent:', message);
    }
  }, []);

  return {
    isConnected,
    connectedUsers,
    sendMessage,
    lastMessage,
    error
  };
}
