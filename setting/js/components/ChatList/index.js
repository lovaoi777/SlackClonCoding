import React, { useCallback, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';
const ChatList = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScorll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScorll}>
        {chatData?.map((chat) => (
          <>
            <Chat key={chat.id} data={chat} />
          </>
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
