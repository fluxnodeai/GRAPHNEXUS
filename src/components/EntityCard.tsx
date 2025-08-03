'use client';

import React from 'react';
import { Entity } from '@/lib/db/supabase';
import styles from './EntityCard.module.css';

interface EntityCardProps {
  entity: Entity;
  selected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewMode?: 'neural' | 'grid' | 'analysis';
}

const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  selected,
  onClick,
  onEdit,
  onDelete,
  viewMode = 'grid'
}) => {
  // Get entity icon based on type with properly sized SVGs
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Person':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'Organization':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Location':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'Event':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'Product':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
    }
  };

  // Get icon class based on type
  const getIconClass = (type: string): string => {
    switch (type) {
      case 'Person':
        return styles.iconPerson;
      case 'Organization':
        return styles.iconOrganization;
      case 'Location':
        return styles.iconLocation;
      case 'Event':
        return styles.iconEvent;
      case 'Product':
        return styles.iconProduct;
      default:
        return styles.iconDefault;
    }
  };

  // Get type badge class
  const getTypeClass = (type: string): string => {
    switch (type) {
      case 'Person':
        return styles.typePerson;
      case 'Organization':
        return styles.typeOrganization;
      case 'Location':
        return styles.typeLocation;
      case 'Event':
        return styles.typeEvent;
      case 'Product':
        return styles.typeProduct;
      default:
        return styles.typeDefault;
    }
  };

  // Get key properties to display based on entity type
  const getKeyProperties = (): { key: string; value: any }[] => {
    const properties = entity.properties || {};
    const keys: string[] = [];
    
    switch (entity.type) {
      case 'Person':
        keys.push('age', 'occupation', 'email');
        break;
      case 'Organization':
        keys.push('industry', 'founded', 'employees');
        break;
      case 'Location':
        keys.push('country', 'city', 'population');
        break;
      case 'Event':
        keys.push('date', 'venue', 'attendees');
        break;
      case 'Product':
        keys.push('price', 'category', 'sku');
        break;
    }
    
    return keys
      .filter(key => properties[key] !== undefined)
      .map(key => ({ key, value: properties[key] }))
      .slice(0, 3);
  };

  // Format property value for display
  const formatPropertyValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  const keyProperties = getKeyProperties();
  const cardClasses = `${styles.entityCard} ${selected ? styles.selected : ''} ${styles[viewMode] || ''}`;

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
          e.preventDefault();
        }
      }}
    >
      <div className={styles.entityCardHeader}>
        <div className={styles.entityInfo}>
          <div className={`${styles.entityIcon} ${getIconClass(entity.type)}`}>
            {getEntityIcon(entity.type)}
          </div>
          <div className={styles.entityDetails}>
            <h3 className={styles.entityName} title={entity.name}>
              {entity.name}
            </h3>
            <span className={`${styles.entityType} ${getTypeClass(entity.type)}`}>
              {entity.type}
            </span>
          </div>
        </div>
        
        {(onEdit || onDelete) && (
          <div className={styles.entityActions}>
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className={styles.actionButton}
                title="Edit entity"
                aria-label="Edit entity"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`${styles.actionButton} ${styles.danger}`}
                title="Delete entity"
                aria-label="Delete entity"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <p className={styles.entityDescription} title={entity.description}>
        {entity.description}
      </p>
      
      {keyProperties.length > 0 && (
        <div className={styles.entityProperties}>
          {keyProperties.map(({ key, value }) => (
            <div key={key} className={styles.entityProperty}>
              <span className={styles.propertyKey}>{key}</span>
              <span className={styles.propertyValue} title={formatPropertyValue(value)}>
                {formatPropertyValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.entityFooter}>
        <span className={styles.entityId}>ID: {entity.id}</span>
        <span className={styles.entityDate}>
          {new Date(entity.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default EntityCard;
