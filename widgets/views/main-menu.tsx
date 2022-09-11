import * as React from 'react';
import { Container } from '../layout/container.tsx';

export interface MainMenuProps {
  title: string;
  logo?: string;
  background?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  title,
  logo,
  background,
}) => {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        background
      }}
    >
      <Container
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '0 15px'
        }}
      >
        <Container
          style={{
            flex: "0 0 50px"
          }}
        >
          <img
            src={logo}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          ></img>
        </Container>
        <h1 style={{flex: "1 1 auto"}} >{title}</h1>
      </Container>
    </Container>
  );
}
