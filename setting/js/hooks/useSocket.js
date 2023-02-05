import { useCallback } from 'react';
import io from 'socket.io-client';
const backurl = 'http://localhost:3095';
const sockets = {};

const useSocket = (workspace) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect(); //데이터 끊는 함수
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backurl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  //   sockets[workspace].emit('hello', 'world'); //수신자명  , 데이터
  //   sockets[workspace].on('message', (data) => {
  //     console.log(data);
  //   });
  //   sockets[workspace].on('data', (data) => {
  //     console.log(data);
  //   });
  //   sockets[workspace].on('onlineList', (data) => {
  //     console.log(data);
  //   });

  return [sockets[workspace], disconnect];
};

export default useSocket;
