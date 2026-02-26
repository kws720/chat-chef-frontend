import React, { useEffect, useState } from "react";
import PrevButton from "../components/PrevButton";
import InfoInput from "../components/InfoInput";
import AddButton from "../components/AddButton";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Info = ({ sendIngredientList }) => {   //() 안에 {} "" props 로 
  // logic
  const history = useNavigate();

  // TODO: set함수 추가하기
  const [ingredientList, setIngredientList] = useState([]); // 사용자가 입력할 재료 목록
  

  const addIngredient = () => {
    console.log("재료 추가하기");
    const id = Date.now();
    // 재료 1개
    const newItem = {
      id,
      label:`ingredient-${id}`,
      text:"재료명",
      value:""
    }

    setIngredientList( (prev)=> [...prev, newItem]);
  };

  const handleChange = (data)  => {
  
    console.log("🚀 ~ handleChange ~ data:", data);

    //받아온 value값으로 재료 목록 업데이트
    setIngredientList((prev) => prev.map((item) => item.id === data.id ? data : item ))

    // console.log("🚀 ~ Info ~ ingredientList:", ingredientList);
  }
  
  const handleDelete = (selectedId)  => {
     
    const filteredList = ingredientList.filter((item) => item.id !== selectedId )
    setIngredientList(filteredList);

  }
  const handleNext = () => {
    // 미션 : 입력된 재료가 1개도 없는 경우 코드 실행 막기
    if(ingredientList.length < 1) return;

    sendIngredientList(ingredientList);
    // console.log("chat페이지로 이동");
    history("/chat");
  };

  // useEffect 3가지 용법
  
  // 1. 해당 컴포넌트에 존재하는 모든 state를 감시하여 state들이 변경이 일어날때 마다 실행
  // 실무에서 과부하가 일어날 수 있기 때문에 잘 사용하지 않음
  // useEffect(() => {
  //   console.log("뭔가가 실행되었습니다.");
  // })

  // // 2. 컴포넌트가 생성되는 딱 한번 실행
  // useEffect(() => {
  //   console.log("✅최초 1회 실행되었습니다.");
  // }, [])

  // 3. 특정 state가 변경이 일어났을때 실행
  // useEffect(() => {
  //   console.log("ingredientList",ingredientList);
  // }, [ingredientList])

  // view
  return (
    <div className="w-full h-full px-6 pt-10 break-keep overflow-auto">
      <i className="w-168 h-168 rounded-full bg-chef-green-500 fixed -z-10 -left-60 -top-104"></i>
      {/* START:뒤로가기 버튼 */}
      <PrevButton />
      {/* END:뒤로가기 버튼 */}
      <div className="h-full flex flex-col">
        {/* TODO:Title 컴포넌트 */}
        <div className="px-2 pt-6">
          <h1 className="text-4.5xl font-black text-white">
            당신의 냉장고를 알려주세요
          </h1>
        </div>
        {/* // TODO:Title 컴포넌트 */}

        {/* START:form 영역 */}
        <div className="mt-20 overflow-auto">
          <form>
            {/* START:input 영역 */}
            <div>
              {ingredientList.map((item) => ( //map : ingredientList 배열 갯수만큼 InfoInput 컴포넌트 추가
                <InfoInput 
                  key={item.id}
                  content={item}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {/* END:input 영역 */}
          </form>
        </div>
        {/* END:form 영역 */}
        {/* START:Add button 영역 */}
        <AddButton onClick={addIngredient} />
        {/* END:Add button 영역 */}
        {/* START:Button 영역 */}
        <Button text="Next" color="bg-chef-green-500" onClick={handleNext} />
        {/* END:Button 영역 */}
      </div>
    </div>
  );
};

export default Info;
