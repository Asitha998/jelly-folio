import React from 'react';
import { SoundManager } from './SoundManager';
import { Theme } from '../types';

interface SoundBarProps {
  theme: Theme;
}

export const SoundBar: React.FC<SoundBarProps> = ({ theme }) => {
  return <SoundManager theme={theme} />;
};

export default SoundBar;
