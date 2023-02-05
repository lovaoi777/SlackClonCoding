import React, { useCallback, useState, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import ChannelList from '@components/ChannelList';
import InviteChannelModal from '@components/InviteWorkspaceModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import CreateChannelModal from '@components/CreateChannelModal';
import DMList from '@components/DMList';
import { useNavigate, Routes, Route, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  Chats,
  MenuScroll,
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from './style';
import { Label, Input, Button } from '@pages/SignUp/styles';
import gravatar from 'gravatar';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const params = useParams();
  const navigator = useNavigate();
  const [ShowWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setnewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setnewUrl] = useInput('');
  const [ShowUserMenu, setShowUserMenu] = useState(false);
  const [ShowCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [ShowCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setshowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setshowInviteChannelModal] = useState(false);
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);

  const { workspace } = params;

  const { data: channelData } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher); //서로 부터 데이터를 받아온다
  // const { data: MemberData } = useSWR(userData ? `/api/workspaces/${workspace}/channels/members` : null, fetcher);
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      console.log(socket);
      socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData, userData]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      })
      .catch((Error) => {
        console.log('데이터', userData);
        console.log(Error);
      });
  }, [userData]);

  if (!userData) {
    navigator('/login');
  }
  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  });
  const onClickUserProfile = useCallback((e) => {
    console.log('click');
    setShowUserMenu((prev) => !prev);
  }, []);
  const Workspacecreate = useCallback(() => {
    console.log('click');
    setShowCreateWorkspaceModal(true);
  }, []);
  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);
  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post('/api/workspaces', { workspace: newWorkspace, url: newUrl }, { withCredentials: true })
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setnewUrl('');
          setnewWorkspace('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );
  const onClickInviteWorkspace = useCallback(() => {
    setshowInviteWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setshowInviteChannelModal(false);
    setshowInviteWorkspaceModal(false);
  }, []);
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);
  return (
    <div>
      <Header>
        <span>test</span>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            {userData && (
              <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            )}
            {ShowUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={ShowUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()} </WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={Workspacecreate}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={ShowWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList userData={userData} />
            <DMList userData={userData} />
            {channelData?.map((v) => (
              <div>{v.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={ShowCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-id">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url">
            <span>워크스페이스 Url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={ShowCreateChannelModal}
        oncloseMoadl={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteChannelModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setshowInviteWorkspaceModal}
      ></InviteChannelModal>
      <InviteWorkspaceModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setshowInviteChannelModal={setshowInviteChannelModal}
      ></InviteWorkspaceModal>
    </div>
  );
};

export default Workspace;
