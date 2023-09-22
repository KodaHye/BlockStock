import { privateApi } from "../index";
 


// 진행 중 대회 api
export const currentContestList = async ( params:params ) => {
  console.log('진행 중 대회 api 진입')
  try{
    console.log(params)
    const res = await privateApi.get(`/contest`, {
      params 
    });
    console.log(res.data);
    return res.data;
  }
  catch(err){
    console.log('진행 중 대회 api',err)
  }
};



// 예정 대회 api
interface paramProps {
  status: string,
  page: number,
  size: number,
  keyWord: string
}
export const expectedContestList = async ( props:paramProps ) => {
  console.log('예정 대회 api 진입')
  try {
    console.log(props)
    const res = await privateApi.get(`/contest`, {params:{
      status: props.status,
      page: props.page,
      size: props.size,
      keyWord: props.keyWord
    }});
    console.log(res);
    return res.data; 
  } catch(error) {
    console.log('예정 대회 api', error)
  }
};


// 완료 대회 api
export const completedContestList = async ( params:params ) => {
  console.log('완료 대회 api 진입')
  try{
    console.log(params)
    const res = await privateApi.get(`/contest`, {
      params 
    });
    console.log(res.data);
    return res.data;
  }
  catch(err){
    console.log('완료 대회 api',err)
  }
};