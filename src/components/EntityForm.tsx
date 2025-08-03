'use client';

import React, { useState, useEffect } from 'react';
import { Entity } from '@/lib/db/supabase';

interface EntityFormProps {
  onSubmit: (entity: Omit<Entity, 'id' | 'created_at'>) => void;
  initialData?: Omit<Entity, 'id' | 'created_at'>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const ENTITY_TYPES = ['Person', 'Organization', 'Location', 'Event', 'Product'];

const EntityForm: React.FC<EntityFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<Entity, 'id' | 'created_at'>>({
    name: '',
    type: 'Person',
    description: '',
    properties: {}
  });

  const [propertyKeys, setPropertyKeys] = useState<string[]>([]);
  const [newPropertyKey, setNewPropertyKey] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPropertyKeys(Object.keys(initialData.properties || {}));
    }
  }, [initialData]);

  // Get suggested property fields based on entity type
  const getSuggestedProperties = (type: string): string[] => {
    switch (type) {
      case 'Person':
        return ['age', 'occupation', 'email', 'phone', 'address'];
      case 'Organization':
        return ['industry', 'founded', 'employees', 'website', 'address'];
      case 'Location':
        return ['country', 'city', 'latitude', 'longitude', 'population'];
      case 'Event':
        return ['date', 'duration', 'venue', 'attendees'];
      case 'Product':
        return ['price', 'category', 'sku', 'inStock', 'releaseDate'];
      default:
        return [];
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If changing entity type, suggest new properties
    if (name === 'type' && value !== formData.type) {
      const suggestedProps = getSuggestedProperties(value);
      const newProperties: Record<string, any> = {};
      
      // Keep existing properties that match suggested ones
      suggestedProps.forEach(prop => {
        if (formData.properties[prop] !== undefined) {
          newProperties[prop] = formData.properties[prop];
        }
      });
      
      setFormData({
        ...formData,
        type: value as string,
        properties: newProperties
      });
      setPropertyKeys(Object.keys(newProperties));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle property value changes
  const handlePropertyChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      properties: {
        ...formData.properties,
        [key]: value
      }
    });
  };

  // Add a new property
  const handleAddProperty = () => {
    if (!newPropertyKey.trim()) {
      setErrors({
        ...errors,
        newPropertyKey: 'Property name cannot be empty'
      });
      return;
    }
    
    if (propertyKeys.includes(newPropertyKey)) {
      setErrors({
        ...errors,
        newPropertyKey: 'Property already exists'
      });
      return;
    }
    
    setFormData({
      ...formData,
      properties: {
        ...formData.properties,
        [newPropertyKey]: newPropertyValue
      }
    });
    
    setPropertyKeys([...propertyKeys, newPropertyKey]);
    setNewPropertyKey('');
    setNewPropertyValue('');
    setErrors({
      ...errors,
      newPropertyKey: ''
    });
  };

  // Remove a property
  const handleRemoveProperty = (key: string) => {
    const newProperties = { ...formData.properties };
    delete newProperties[key];
    
    setFormData({
      ...formData,
      properties: newProperties
    });
    
    setPropertyKeys(propertyKeys.filter(k => k !== key));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter entity name"
        />
        {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="type" className="form-label">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="form-input"
        >
          {ENTITY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && <p className="text-error text-sm mt-1">{errors.type}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="form-input form-textarea"
          placeholder="Enter entity description"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Properties</label>
        
        <div className="space-y-2 mb-4">
          {propertyKeys.map(key => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="text"
                value={key}
                disabled
                className="form-input w-1/3 opacity-70"
              />
              <input
                type="text"
                value={formData.properties[key] || ''}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveProperty(key)}
                className="btn p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newPropertyKey}
            onChange={(e) => setNewPropertyKey(e.target.value)}
            className="form-input w-1/3"
            placeholder="Property name"
          />
          <input
            type="text"
            value={newPropertyValue}
            onChange={(e) => setNewPropertyValue(e.target.value)}
            className="form-input flex-1"
            placeholder="Property value"
          />
          <button
            type="button"
            onClick={handleAddProperty}
            className="btn p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {errors.newPropertyKey && <p className="text-error text-sm mt-1">{errors.newPropertyKey}</p>}
        
        <div className="mt-2">
          <p className="text-sm text-secondary">Suggested properties for {formData.type}:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {getSuggestedProperties(formData.type).map(prop => (
              <button
                key={prop}
                type="button"
                className={`badge ${propertyKeys.includes(prop) ? 'opacity-50' : ''}`}
                onClick={() => {
                  if (!propertyKeys.includes(prop)) {
                    setNewPropertyKey(prop);
                  }
                }}
                disabled={propertyKeys.includes(prop)}
              >
                {prop}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
        >
          {isEditing ? 'Update Entity' : 'Create Entity'}
        </button>
      </div>
    </form>
  );
};

export default EntityForm;
