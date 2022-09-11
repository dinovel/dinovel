import * as React from 'react';

export interface ContainerProps {
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps & { children: React.ReactNode }> = props => {
  return (
    <div
      style={props.style ?? {}}
    >
      {props.children}
    </div>
  );
};

function getValue(s: number | string | undefined, m: 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax') {
  if (typeof s === 'number') {
    return s + m;
  }
  return s;
}
