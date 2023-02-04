import React, { CSSProperties, useCallback } from 'react';
import { CreateMenu, CloseModalButton } from './style';
const Menu = ({ children, style, show, closeButton, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation;
  }, []);
  if (!show) return null;
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
