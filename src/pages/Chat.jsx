import React, { useEffect, useState } from "react";
import MessageBox from "../components/MessageBox";
import PrevButton from "../components/PrevButton";
import { MoonLoader } from "react-spinners";

const Chat = ({ingredientList}) => {
  // logic
  const endpoint = process.env.REACT_APP_SERVER_ADDRESS;  //.env 파일 내 변수 담기
  
  const [value, setValue] = useState("");

  // TODO: set함수 추가하기
  const [messages, setMessages] = useState([]); // chatGPT와 사용자의 대화 메시지 배열

  const [infoMessages, setInfoMessages] = useState([]) // 초기세팅 메시지

  const [isInfoLoading, setIsInfoLoading] = useState(true); // 최초 정보 요청시 로딩
  const [isMessageLoading, setIsMessageLoading] = useState(false); // 사용자와 메시지 주고 받을때 로딩
  const hadleChange = (event) => {
    const { value } = event.target;
    console.log("value==>", value);
    setValue(value);
  };

  const sendMessage = async (userMessage) => {
    
    //2. AI메시지 로딩바 보여주기
    setIsMessageLoading(true);
    
    // 메시지 API 요청
    try {
      const response = await fetch(`${endpoint}/message`, {
        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({userMessage,messages:[...infoMessages,...messages]})
      })

      const result = await response.json();
      console.log("🚀 ~ sendMessage ~ result:", result.data);
    
      //4. 답변UI 업데이트
      setMessages((prev) => [...prev, { role:"assistant", content:result.data.content }]);
    }catch(error){
      console.error("🚀 ~ hadleSubmit ~ error:", error)
    }finally{
      // 로딩스피너 off
      setIsMessageLoading(false);
    }
  }

  const hadleSubmit = (event) => {
    event.preventDefault();
    const userMessage = { role:"user", content: value.trim() };
    //console.log("메시지 보내기");
    //1. 사용자 메시지 UI업데이트  
    setMessages((prev) => [...prev,userMessage]);

    //3. 메시지 API 요청
    sendMessage(userMessage);

    //5. 사용자 input 초기화
    setValue("");
    
  };

  const sendInfo = async () => {
    setIsInfoLoading(true);
    try {
      // 초기세팅 api 호출
      const response = await fetch(`${endpoint}/recipe`, {    //async 함수에서 api를 통해서 데이터를 받아와야 하는경우 await 문법을 통해 데이터 받은 후 처리되도록 함.
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({ ingredientList })
      });

      // 응답 데이터를 자바스크립트 객체로 변환
      const result = await response.json();
      console.log("🚀 ~ sendInfo ~ result:", result)

      // 데이터가 잘 들어온 경우에만 실행 (데이터가 제대로 들어오지 않은 경우 종료)
      if(!result.data) return;
      
      // 초기 2개 메시지 저장
      const removeLastMessageList = result.data.filter((_,index, arr) => index !== arr.length - 1);

      setInfoMessages(removeLastMessageList);

      // 마지막 대화는 메시지박스에 저장
      const { role, content } = result.data[result.data.length-1];
      setMessages((prev) => [...prev,{role, content}]);
    } catch (error) {
      console.error("🚀 ~ sendInfo ~ error:", error)
    } finally{
      setIsInfoLoading(false);
    } 
  }

  useEffect(() => {
    // console.log("🚀 ~ Chat ~ ingredientList:", ingredientList);
    sendInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // view
  return (
    <div className="w-full h-full px-6 pt-10 break-keep overflow-auto">
      {isInfoLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MoonLoader color="#46A195" />
          </div>
        </div>
      )}

      {/* START: 로딩 스피너 */}
      {/* START:뒤로가기 버튼 */} 
      <PrevButton />
      {/* END:뒤로가기 버튼 */}
      <div className="h-full flex flex-col">
        {/* START:헤더 영역 */}
        <div className="-mx-6 -mt-10 py-7 bg-chef-green-500">
          <span className="block text-xl text-center text-white">
            맛있는 쉐프
          </span>
        </div>
        {/* END:헤더 영역 */}
        {/* START:채팅 영역 */}
        <div className="overflow-auto">
          <MessageBox messages={messages} isLoading={isMessageLoading} />
        </div>
        {/* END:채팅 영역 */}
        {/* START:메시지 입력 영역 */}
        <div className="mt-auto flex py-5 -mx-2 border-t border-gray-100">
          <form
            id="sendForm"
            className="w-full px-2 h-full"
            onSubmit={hadleSubmit}
          >
            <input
              className="w-full text-sm px-3 py-2 h-full block rounded-xl bg-gray-100 focus:"
              type="text"
              name="message"
              value={value}
              onChange={hadleChange}
            />
          </form>
          <button
            type="submit"
            form="sendForm"
            className="w-10 min-w-10 h-10 inline-block rounded-full bg-chef-green-500 text-none px-2 bg-[url('../public/images/send.svg')] bg-no-repeat bg-center"
          >
            보내기
          </button>
        </div>
        {/* END:메시지 입력 영역 */}
      </div>
    </div>
  );
};

export default Chat;
