// WalletStatusDisplay.tsx
import React from 'react';
import styled from 'styled-components';

interface WalletStatusDisplayProps {
  message: string;
  imageUrl: string;
  buttonUrl: string;
}

const WalletStatusDisplay: React.FC<WalletStatusDisplayProps> = ({ message, imageUrl, buttonUrl }) => {
    return (
      <Container>
        <Image src={imageUrl} alt="Status" />
        <Message>{message}</Message>
        <Button href={buttonUrl} target="_blank" rel="noopener noreferrer">
          <img src="https://storage.googleapis.com/cryptomonos/monos/MRKT_logo.png" alt="Button Text" style={{ height: '30px' }} />
        </Button>
      </Container>
    );
  };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // Take up full viewport height
`;

const Image = styled.img`
  max-width: 800px; // Set a max-width for the image
  margin-bottom: 20px;
  border-radius: 20px;

  @media (max-width: 1200px) {
    max-width: 400px;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const Message = styled.p`
  font-size: 1.5rem;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  margin-bottom: 20px;
  margin-top: 5px;
  @media (max-width: 768px) {
    font-size: 1.6em;
  }
`;

const Button = styled.a`
  background-color: #16D3D3; // Example button color
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #1A1A1A;
  padding: 10px 15px 5px 15px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; // Darken the button on hover
  }
`;

export default WalletStatusDisplay;