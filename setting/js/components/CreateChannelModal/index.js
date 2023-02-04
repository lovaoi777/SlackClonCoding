import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Label, Input, Button } from '@pages/SignUp/styles';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const params = useParams();
  const { workspace } = params;
  const { data: userData } = useSWR('/api/users', fetcher);
  const { revalidate: revalidateChannel } = useSWR(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();

      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannel }, { withCredentials: true })
        .then(() => {
          revalidateChannel(), setShowCreateChannelModal(false), setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newChannel],
  );
  if (!show) {
    return null;
  }
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
