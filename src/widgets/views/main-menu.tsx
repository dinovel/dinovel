import * as React from 'react';

export interface MainMenuProps {
  title: string;
  logo?: string;
  backImg?: string;
  backColor?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  title,
  logo,
  backImg,
  backColor,
}) => {
  return (
    <div>{title}</div>
  );
}
