import { privateApi, } from "..";

interface pwData {
    originPassword: string;
    newPassword: string;
    confirmPassword: string,
  }
interface nickName {
    nickname: string;
}
  
// 마이페이지 조회 api
export const getmypage = async () => {
    try{
        // console.log('마이페이지 try진입')
        const response = await privateApi.get("/member");
        // console.log('데이터야?', response.data);
        return response.data;    
    }catch (error) {
        console.error("error!", error);
    }
};

// 비밀번호 수정
export const putPassword = async(pw : pwData) => {
    try{
        // console.log('-----------------',pw)
        const response = await privateApi.put("/member/password", pw);
        return response.request
    }catch(error){
        console.log("error!", error)
    }
}

// 닉네임 수정
export const putNickName = async(name: nickName) => {
    try{
        // console.log('-----------------', name)
        const response = await privateApi.put("/member", name);
        // console.log('결과', response.request)
        return response

    }catch(error){
        console.log('err', error)
    }
}