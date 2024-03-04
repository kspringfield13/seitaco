import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from 'styled-components'; // Import createGlobalStyle
import * as C from "../../home/style";
// Other imports remain unchanged...

// Define GlobalStyle component
const GlobalStyle = createGlobalStyle`
  html, body {
    max-width: 100%;
    overflow-x: hidden;
  }
`;
const Home = () => {
    // Your existing useState and useEffect hooks...

    return (
        <>
          <GlobalStyle /> {/* Include GlobalStyle component */}
          <C.Home>
              <C.Container>
                  {/* Your existing component structure... */}
              </C.Container>
          </C.Home>
        </>
    );
};

export default Home;