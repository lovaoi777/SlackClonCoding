import React, { useCallback } from 'react';
import { Header, Container } from './style';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      setChat('');
    },
    [setChat],
  );
  return (
    <>
      <Container>
        <Header>채널!</Header>
        <ChatList />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </>
  );
};
export default Channel;
