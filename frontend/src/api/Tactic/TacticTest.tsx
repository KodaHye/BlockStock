import { privateApi } from "../index";

// 주식 검색
export const tacticSearchOption = async (keyword: string, isSearch: boolean) => {
  console.log(keyword + " " + isSearch);
  try {
    const res = await privateApi.get(`/option`, { params: { like: !isSearch, keyword: keyword } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// 주식 검색
export const tacticOptionDetail = async (optionCode: string) => {
  console.log(optionCode);
  try {
    const res = await privateApi.get(`/option/` + optionCode);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// 관심 종목 추가
export const addLikedOption = async (code: any) => {
  console.log(code);
  try {
    const res = await privateApi.post(`/option/like`, code);
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

// 관심 종목 삭제
export const deleteLikedOption = async (code: string) => {
  console.log(code);
  try {
    const res = await privateApi.delete(`/option/like/` + code);
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export interface tacticTestProps {
  optionCode: string;
  tacticPythonCode: string | undefined;
  tacticJsonCode: string | undefined;
  startAsset: number;
  startTime: string;
  term: string;
  repeatCnt: number;
}

// 전략 테스트
export const tacticTest = async (data: tacticTestProps) => {
  console.log("전략 테스트");
  console.log(data);
  try {
    const res = await privateApi.post(`/tactic/test`, data);
    console.log("testresponse");
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export interface saveTacticProps {
  title: string;
  optionCode: string;
  tacticJsonCode: string;
  tacticPythonCode: string;
  imgPath: string;
  testReturns: number;
}

// 전략 생성
export const tacticCreate = async (data: saveTacticProps) => {
  console.log(data);
  try {
    const res = await privateApi.post(`/tactic`, data);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const tacticImg = async (formData: FormData) => {
  console.log(formData.get("file"));
  try {
    const res = await privateApi.post(`/tactic/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// 전략 조회
export const tacticImport = async (param: number) => {
  console.log(param);
  try {
    const res = await privateApi.get(`/tactic/`+param);
    // const res = await privateApi.get(`/tactic`, { params: { id: param } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// defArray:JSON.parse(res.tacticJsonDefCode),
// settingArray:JSON.parse(res.tacticJsonSetCode),
// getArray:JSON.parse(res.tacticJsonGetCode)
export interface updateTacticProps {
  id: number;
  title: string;
  optionCode: string;
  tacticJsonCode: string;
  tacticPythonCode: string;
  imgPath: string;
  testReturns: number;
}

// 전략 수정
export const tacticUpdate = async (data: updateTacticProps) => {
  console.log(data);
  try {
    const res = await privateApi.put(`/tactic`, data);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// 전략 삭제
export const tacticDelete = async (params: number) => {
  console.log(params);
  try {
    const res = await privateApi.delete(`/tactic`, { params });
    return res;
  } catch (err) {
    console.log(err);
  }
};
