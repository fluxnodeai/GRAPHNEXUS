'use client';

import React, { useEffect, useRef } from 'react';
import EntityForm from './EntityForm';
import { Entity } from '@/lib/db/supabase';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entity: Omit<Entity, 'id' | 'created_at'>) => void;
  initialData?: Omit<Entity, 'id' | 'created_at'>;
  isEditing?: boolean;
  title: string;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  title
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <EntityForm
            onSubmit={(entity) => {
              onSubmit(entity);
              onClose();
            }}
            initialData={initialData}
            isEditing={isEditing}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
