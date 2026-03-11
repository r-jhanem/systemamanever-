import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export interface ServiceButton {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
}