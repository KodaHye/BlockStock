import React, {useState, useEffect} from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilValue } from "recoil";
import style from './Carousel.module.css'
import {
    Container,
    Modal,
    Header,
    CloseBtn,
    Title,
    Schedule,
    Personnel,
    Wrapper,
    RankUser,
    RankImage,
    RankUserNickName,
    ContestReturn,
    Line,
    Participant,
    NoRankImage,
    NotUser
} from './CompletedContestModal.style'
// 날짜 변환
import dayjs from "dayjs";
function CompletedContestModal({onClose, selectedContest, rank}){

  const [userRank, setUserRank] = useState([])
    useEffect(()=>{
      console.log(rank,'랭킹 모달')
      setUserRank(rank)
    },[rank])

    return(
        <Container>
            <Modal>
                <Header>
                    <Title>[경진대회] {selectedContest.title}</Title>
                    <CloseBtn onClick={onClose}><CloseIcon/></CloseBtn>
                </Header>
                <Schedule>대회 기간 : {dayjs(selectedContest.startTime).format('YYYY/MM/DD HH:mm')}부터 ~ {dayjs(selectedContest.endTime).format('YYYY/MM/DD HH:mm')}까지</Schedule>
                {selectedContest.maxCapacity > 0 && (
                <Personnel>참가 인원 수 : {selectedContest.joinPeople} / {selectedContest.maxCapacity} </Personnel>
                )}
                {userRank.length === 0 ? (
                  <NotUser>유저가 없습니다</NotUser>
                ) : (
                <Wrapper>
                    <RankUser>
                    <div className={style.carousel}>
                        <div className={style.carousel_content}>
                        <div className="carousel-item" style={{width: '170px', height: '220px'}}>
                          {userRank[0] ? (
                                <>
                                  <RankImage src={`https://j9b210.p.ssafy.io:8443/api/member/profile/${userRank[0].memberId}`} />
                                  <h2 style={{textAlign: 'center', margin: '5px 0px 0px 0px', fontSize:'22px'}}>1등</h2>
                                  <RankUserNickName>
                                    {userRank[0]?.nickName ? (
                                      <>{userRank[0].nickName}</>
                                    ) : (
                                      <>NickName이 없습니다.</>
                                    )}
                                  </RankUserNickName>
                                  <div style={{textAlign: 'center', display:'flex'}}>
                                    <div style={{color:'#8A8A8A', margin:'8px 5px 0px 50px', fontSize:'12px'}}>
                                      수익률 :
                                    </div>
                                    <ContestReturn style={{ color: userRank[0].returns === '-' ? 'blue' : 'red' }}>
                                      {Math.round(userRank[0].returns * 10) / 10}%
                                    </ContestReturn>
                                  </div>
                                </>
                              ) : (
                                <NotUser>유저가 없습니다</NotUser>
                              )}
                            </div>

                        <div className="carousel-item" style={{width: '170px', height: '220px'}}>
                              {userRank[1] ? (
                                  <>
                                    <RankImage src={`https://j9b210.p.ssafy.io:8443/api/member/profile/${userRank[1].memberId}`} />
                                    <h2 style={{textAlign: 'center', margin: '5px 0px 0px 0px', fontSize:'22px'}}>2등</h2>
                                    <RankUserNickName>
                                    {rank[1].nickName ? (
                                      <>{rank[1].nickName}</>
                                    ) : (
                                      <>NickName이 없습니다.</>
                                    )}
                                  </RankUserNickName>
                                    <div style={{textAlign: 'center', display:'flex'}}>
                                      <div style={{color:'#8A8A8A', margin:'8px 5px 0px 50px', fontSize:'12px'}}>
                                          수익률 :
                                      </div>
                                      <ContestReturn style={{ color: userRank[1].returns === '-' ? 'blue' : 'red' }}>
                                      {Math.round(userRank[1].returns * 10) / 10}%                                      </ContestReturn>
                                    </div>
                                </>
                                ) : (
                                  <NotUser>유저가 없습니다</NotUser>
                              )}
                                
                        </div>
                        <div className="carousel-item" style={{width: '170px', height: '220px'}}>
                          {userRank[2] ? (
                            <>
                              <RankImage src={`https://j9b210.p.ssafy.io:8443/api/member/profile/${userRank[2].memberId}`} />
                                  <h2 style={{textAlign: 'center', margin: '5px 0px 0px 0px', fontSize:'22px' }}>3등</h2>
                                  <RankUserNickName>
                                    {rank[2]?.nickName ? (
                                      <>{rank[2].nickName}</>
                                    ) : (
                                      <>NickName이 없습니다.</>
                                    )}
                                  </RankUserNickName>
                                  <div style={{textAlign: 'center', display:'flex'}}>
                                    <div style={{color:'#8A8A8A', margin:'8px 5px 0px 50px', fontSize:'12px'}}>
                                        수익률 :
                                    </div>
                                    <ContestReturn style={{ color: userRank[2].returns === '-' ? 'blue' : 'red' }}>
                                      {Math.round(userRank[2].returns * 10) / 10}%                                    </ContestReturn>
                                  </div>
                                </>
                            ) : (
                            <NotUser>유저가 없습니다</NotUser>
                              )}

                          </div>
                        </div>
                    </div>
                    </RankUser>

                    <Line/>

                  <Participant>
                    {userRank.length < 4 ? (
                      <></>
                    ) : (
                      <>
                      {userRank.slice(3).map((participant, participantIndex) => (
                        <div key={participantIndex}>
                          <div style={{margin:'0px 0px 0px 10px', display:'flex'}}>
                            <div style={{width:'40px', margin:'10px 0px 5px 15px', color:'#8A8A8A', fontSize:'15px'}}>
                              {participantIndex+4}등
                            </div>
                            <NoRankImage src={`https://j9b210.p.ssafy.io:8443/api/member/profile/${participant.memberId}`} />
                            <div style={{margin:'10px 15px 0px 0px', fontSize:'12px', fontWeight:'bold', width:'50px'}}>
                              {participant.nickName ? (
                                <>{participant.nickName}</>
                                ) : (
                                <>NickName이 없습니다.</>
                                )}
                            </div>
                            <div style={{display:'flex', marginTop:'12px', fontSize:'10px'}}>
                              <div style={{color:'#8A8A8A', marginRight:'10px'}}>
                                수익률 : 
                              </div>
                              <div style={{ color: participant.returns === '-' ? 'blue' : 'red', fontWeight:'bold', fontSize: '12px' }}>
                                {Math.round(participant.returns * 100) / 100}%
                              </div>
                            </div>
                          </div>
                          <hr style={{width:'270px'}}/>
                        </div>
                      ))}
                      </>
                    )}
                  </Participant>

                </Wrapper>
                )}
            </Modal>
        </Container>
    )
}

export default CompletedContestModal