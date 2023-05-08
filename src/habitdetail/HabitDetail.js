import "./HabitDetail.css";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import moment from 'moment';
import chart from "./chart.png"
import React from "react";
import ProgressBar from "./ProgressBar";
// import cherry1 from "./cherry1.png"


const HabitDetail = () => {

     //추가
     let [insert, setInsert] = useState(0);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/detail/${habitIdx}`)
            .then(response => {
                console.log(response);
                setHabit(response.data.habitDto);
                console.log(response.data.habitContent);
                setDate(response.data.registDt);
                console.log(response.data.habitHistoryList);
                console.log(habithistory[0]);
                sethabitHistory(response.data.habitHistoryList);
                setCount(response.data.count);
                setPercent(response.data.percent);
                // var sum = 0
                // for (const history in habithistory) {
                //     sum += (habithistory[history].doneYn)*1;  
                // }
                // setHabitSum(sum); 
            })
            .catch(error => console.log(error));
    }, [insert]);

   

    const [habit, setHabit] = useState({});
    const { habitIdx } = useParams();
    const [habithistory, sethabitHistory] = useState({})
    // const [habitsum, setHabitSum] = useState('');
    const [date, setDate] = useState('');
    const [count, setCount] = useState(0);
    const [percent, setPercent] = useState(0);


    // 서버에서 넘어온 registDt에서 숫자만 추출 -> int 타입으로 변환 -> 날짜 형식으로 변환
    const createMonth = () => {
        const newDate = new moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'); 
        const registDate = new Date(newDate);
        let month = registDate.getMonth() + 1;
        let monthEn = new Date(newDate).toLocaleDateString('en', { month: "short" })

        return <>{month} {monthEn}</>
    }

    // 해당 달의 말일 구하기 // 되있는 것은 이미지 변경 필요 이것먼저 해부리는게 좋을듯. 그래야 시각화 잘됨
    const createCircle = () => {
        const newDate = new moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
        let year = newDate.substring(0, 4);
        let month = parseInt(newDate.substring(4, 6));
        let lastDate = new Date(year, month, 0);
        let lastDay = lastDate.getDate(); //
        let arr = [];
        for (let i = 1; i < lastDay+1; i++) {
            if (habithistory[i-1].doneYn == 0) { 
                arr.push(
                    <div className='habit_detail_content_circle'>
                        <button type="button" value={i} onClick={() => handlerClick(i)}>{i}</button>
                    </div>
            )}
            else {
                arr.push(
                    <div className='habit_detail_content_cherry1'>
                        <button type="button" value={i} onClick={() => handlerClick(i)}></button>
                    </div>
                )
            }
        } 
        return arr;
    }
    
    const handlerClick = (e) => {
        const todaydate = new Date();
        const newtodaydate = new moment(todaydate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        if (e*1 < 10) {e = '0'+e }; 
        if (newtodaydate == date.substring(0,8)+e) {
        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/check`,
            {
                'habitIdx': habitIdx,
                'doneDt': date.substring(0, 8) + e
            })
            .then(response => {
                if (response.data === 1) {
                } else {
                    alert(response.data);
                    return;
                }
            })
            .catch(error => {
                console.log(error.response);
                // alert('취소안됨');
                setInsert(insert +1);
                return;
            });
        };
    };



    return (
        <div className="habit_tracker_container">
            <div className="habit_tracker_title_circle">
                <img className="habit_tracker_title_circle_icon" src={chart}></img>
            </div>
            <h2 className="habit_tracker_title">MAKE A HABIT IN 30 DAYS!!</h2>

            <div className="habit_detail_container">
                {/* 제목 */}
                <div className="habit_detail_title">{createMonth()}</div>
                {/* 프로그레스 바 */}
                <div><ProgressBar /></div>
                {/* 내용 */}
                <div className="habit_detail_content_container">
                    <div className="habit_detail_content_title">
                        <p className="habit_content_title">{habit.habitContent}</p>
                    </div>
                    <div className="habit_detail_content_title_line"></div>

                    {/* 원형 버튼 */}
                    <div>{createCircle()}</div>
                    <div className="habit_detail_rate">
                        달성일 : {count}일
                        <br></br>
                        달성률 : {percent}%
                    </div>
                </div>
            </div>
        </div>

    );
}
export default HabitDetail; 