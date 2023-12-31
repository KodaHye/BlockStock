import React, {useState, useEffect} from "react";
import { useRecoilState } from "recoil";
import {commentlist} from '../../../../recoil/FreeBoard/Comment'
import Swal from 'sweetalert2';

import {
  Container,
  Header,
  UserImg,
  NickName,
  Day,
  DeleteBtn,
  Comment,
  Title
} from './CommentList.style'

// 자유게시판 댓글 api
import {freecommentList, commentDelete} from '../../../../api/FreeBoard/Comment'

// 전략게시판 댓글 api
import { tacticcommentList,tacticcommentDelete } from '../../../../api/TacticBoard/Comment'

// userId
import { useRecoilValue } from 'recoil';
import { CurrentUserAtom } from '../../../../recoil/Auth';
 // 날짜 변환
 import dayjs from "dayjs";
function CommentList(props) {
  // userId
  const currentUser = useRecoilValue(CurrentUserAtom);
  const userId = currentUser.userid;

  const [commentlists, setCommentlists] = useRecoilState(commentlist)

  const [comment, setComment] = useState([])

  const { id, type } = props.state

  // 댓글 리스트 api 호출
  useEffect(()=>{
    comments()
    console.log('댓글 리스트')
    console.log(type,'type')
    console.log(id,'id')
  },[])
  
  // 댓글 작성시 recoil에 저장 후 다시 불러오기
  useEffect(()=>{
    console.log(commentlists,'commentlists')
    setComment(commentlists)
  },[commentlists])
  
  const comments =()=>{
    if (type==='free'){
      freecommentapi()
    } else if ( type==='tactic'){
      tacticcommentapi()
    }
  }
  // ============================================

  // api 자유게시판 댓글 =========================
  const freecommentapi = async ()=>{
    const res = await freecommentList(id)
    console.log(res)
    setComment(res.data)
    setCommentlists(res.data)
  }

  // api 자유 게시판 댓글 삭제 =======================
  const freecommentdelete = async(commentId)=>{
    const res = await commentDelete(commentId)
    console.log(res)
    if(res.status===200){
      comments()
    }
  }

  // api 전략게시판 댓글 =====================================
  const tacticcommentapi = async ()=>{
    const res = await tacticcommentList(id)
    console.log('전략게시판 댓글----------')
    console.log(comment)
    setComment(res)
    setCommentlists(res)
  }
  // api 전략 게시판 댓글 삭제 ===============================
  const commentdeleteapi = async (commentId)=>{
    console.log(commentId, '댓글 id')
    const res = await tacticcommentDelete(commentId)
    console.log(res)
    if(res.status===200){
      comments()
    }
  }


  // 댓글 삭제 id는 댓글 id
  const handleDelete = (commentId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      // title: '삭제?',
      // text: "You won't be able to revert this!",
      text: '정말 삭제하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `<span>삭제</span>`,
      cancelButtonText: '<span>취소</span>',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (type==='free'){
          console.log(commentId);
          freecommentdelete(commentId);
        }else if (type==='tactic'){
          console.log(commentId);
          commentdeleteapi(commentId)
        }
        swalWithBootstrapButtons.fire({
          title: '삭제되었습니다',
          icon:'success',
          timer: 1000, // 2초 후에 자동으로 사라집니다 (밀리초 단위)
          showConfirmButton: false, // 확인 버튼을 표시하지 않음
          showCancelButton: false, // 취소 버튼을 표시하지 않음
        })
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: '취소되었습니다',
          icon:'error',
          timer: 1000, // 2초 후에 자동으로 사라집니다 (밀리초 단위)
          showConfirmButton: false, // 확인 버튼을 표시하지 않음
          showCancelButton: false, // 취소 버튼을 표시하지 않음
        })
        }
      })
  };


  return (
    <>
      <Container>
        {comment.length === 0 ? (
          <Title>댓글이 없습니다.</Title>
        ) : (
          comment.map((item, index) => (
            <div key={index}>
              <Header>
                <div style={{ display: 'flex', width: '500px' }}>
                  <UserImg src={`https://j9b210.p.ssafy.io:8443/api/member/profile/${item.memberId}`} />
                  <NickName>{item.nickname}</NickName>|
                  <Day>
                    {dayjs(item.createdAt).format('YYYY.MM.DD HH:mm')} 
                  </Day>
                </div>
                {type === 'free' ? (
                  <>
                  {item.memberId === userId ? (
                    <DeleteBtn onClick={() => handleDelete(item.commentId)}>삭제</DeleteBtn>
                    ) : (
                      <></>
                      )}
                  </>
                      ) : (
                        <>
                    {item.memberId === userId ? (
                      <DeleteBtn onClick={() => handleDelete(item.id)}>삭제</DeleteBtn>
                      ) : (
                        <></>
                        )}
                        </>
                )}
              </Header>
               {/* 줄바꿈 적용 넘어갈 경우 다음 줄로 */}
              <Comment>
                {item.content}
              </Comment>
              <hr style={{ border: '1px solid #F4F1F1' }} />
            </div>
          ))
        )}
      </Container>
    </>
  )
}

export default CommentList
