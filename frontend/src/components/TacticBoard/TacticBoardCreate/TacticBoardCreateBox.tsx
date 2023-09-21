import React, { useState, useEffect } from "react";
import './style.css'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import {
  Container,
  TitleInput,
  ContentInput,
  Wrapper,
  ImgContainer,
  ImgBox,
  FileBtn,
  ButtonBox,
  Button1,
  Button2,
  Line,
  Img,
} from './TacticBoardCreateBox.style'
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { tacticdata } from '../../../recoil/TacticBoard/TacticBoardBox'

import ContestTaticModal from "../../Contest/ContestStore/ExpectedContest/ContestTaticModal";


function TacticBoardCreateBox(){

  // 전략 이미지
  const tacticImg = useRecoilValue(tacticdata);

  const navigate = useNavigate();
  const [title, setTitle] = useState(''); 
  const [content, setContent] = useState(''); 
  const [file, setFile] = useState(tacticImg)
  const [isModalOpen, setIsModalOpen] = useState(false);


  // // 이미지 읽기
  // useEffect(() => {
  //   if (tacticImg) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFile(reader.result);
  //     };
  //     // 직접 File 객체를 전달합니다.
  //     reader.readAsDataURL(tacticImg);
  //   }
  // }, [tacticImg]);

  // 글 등록
  const handleSubmit = () => {

    const formData = new FormData();
    formData.append('file', file)

    formData.append('title', new Blob([JSON.stringify(title)], {
      type: "application/json"
    }));
    formData.append('content', new Blob([JSON.stringify(content)], {
      type: "application/json"
    }));

    console.log("title:", title);
    console.log("content:", content);
    console.log("file:", file);
    console.log("Form Data:", formData);
  };



  // 모달 열고 닫기 ======================================
  const OpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const CloseModal = () => {
    setIsModalOpen(false);
  };
  // 모달 열고 닫기 ======================================


  return(
    <>
    <Container>
      <TitleInput
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value )}
          />
      <Line />
      <Wrapper>
        <ImgContainer>
            <ImgBox>
            {file ? 
            (<Img onClick={OpenModal} src={tacticImg}/>) :
                (<FileBtn onClick={OpenModal}>
                    전략 선택하기
                </FileBtn>)}
            </ImgBox>
        </ImgContainer>
      <ContentInput
          placeholder="내용을 입력하세요."
          onChange={(e) => setContent(e.target.value)}
        />

      </Wrapper>
      <Line />
    </Container>
    <ButtonBox>
      <Button1 onClick={()=>navigate('/tacticboard')}>목록</Button1>
      <Button2 onClick={handleSubmit}>등록</Button2>
    </ButtonBox>

    {isModalOpen ? <ContestTaticModal type={'tactic'} onClose={CloseModal} /> : null}

    </>
  )
}
export default TacticBoardCreateBox;