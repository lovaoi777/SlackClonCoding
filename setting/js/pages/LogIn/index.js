import React, { useState, useCallback } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '../SignUp/styles';
import useInput from '../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  const navigator = useNavigate();
  const [email, onChangeEmail] = useInput(' ');
  const [password, onChangePassword] = useInput('');
  const [logInError, setLogInError] = useState(false);
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher); //fetcher 어떻게 처리 할것인가
  //dedupingInterval: 10000, //시간내에 캐시를 불러온다 //10초내에
  //revalidate 하고싶을떄
  //revalidata 와 mutate 의 차이점
  //revalidata는 서버에 데이터를 요청하여 다시 받는경우
  //mutate는 서버에 요청하지 않고 data를  수정하는 경우
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          console.log(response.data, '응답');
          revalidate();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode == 401);
          alert(error);
        });
    },
    [email, password, mutate],
  );
  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    navigator('/workspace/sleact/channel/일반 ');
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} style={{}} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
