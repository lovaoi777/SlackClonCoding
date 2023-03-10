import React, { useState, useCallback } from 'react';
import axios from 'axios';

import { Header, Form, Label, Input, LinkContainer, Error, Button, Success } from './styles';
import useInput from '../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
const SignUp = () => {
  const navigator = useNavigate();
  const [email, onChangeEmail, setEmail] = useInput(' ');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignSuccess] = useState(false);
  const { data, error, revalidate } = useSWR('/api/users', fetcher);
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        console.log('서버로 회원가입하기');
        setSignUpError('');
        setSignSuccess(false);
        axios
          .post('/api/users', { email, nickname, password }, { withCredentials: true })
          .then((response) => {
            console.log(response);
            setSignSuccess(true);
          }) //성공
          .catch((error) => {
            console.log(error.response);
            setSignUpError(error.response.data);
          }) //실패
          .finally(() => {}); //성공을 하든 실패하든 실행하는것 ( 공통적인것) try, catch도 가능
      }
      // console.log(email, nickname, password, passwordCheck, mismatchError);
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }
  if (data) {
    navigator('/workspace/channel');
  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
