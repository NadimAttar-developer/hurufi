import type { CSSProperties, ReactNode } from 'react';
import styles from './Planet.module.css';

export type PlanetState = 'done' | 'current' | 'locked';

interface PlanetProps {
  letter: string;
  state: PlanetState;
  size?: number;
  label: string;
  selected?: boolean;
  special?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

/** A letter planet: mint when complete, orange for the current station, dashed when locked. */
export function Planet({ letter, state, size = 80, label, selected, special, onClick }: PlanetProps) {
  const style = { '--size': `${size}px` } as CSSProperties;
  const className = [
    styles.planet,
    styles[state],
    selected ? styles.selected : '',
    special && state === 'locked' ? styles.special : '',
  ].join(' ');

  return (
    <button type="button" className={className} style={style} aria-label={label} aria-pressed={selected} onClick={onClick}>
      <span className="learn" aria-hidden="true">{letter}</span>
    </button>
  );
}
