import { MdOutlineCheckCircle } from 'react-icons/md';
import { useEffect, useState } from "react";
import React from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import moment from 'moment';
import chart from "../img/chart.png"
import swal from 'sweetalert2';
import ProgressBar from "./ProgressBar";
import "./HabitDetail.css";


const HabitDetail = ({ history }, props) => {

    let [insert, setInsert] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/habit/detail/${habitIdx}`)
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

            })
            .catch(error => console.log(error));
    }, [insert]);


    const [habit, setHabit] = useState({});
    const { habitIdx } = useParams();
    const [habithistory, sethabitHistory] = useState({})
    const [date, setDate] = useState('');
    const [count, setCount] = useState(0);
    const [percent, setPercent] = useState(0);

    // 목록으로 돌아가기
    const handlerBack = () => {
        history.push('/');
    }

    // 서버에서 넘어온 registDt에서 숫자만 추출 -> int 타입으로 변환 -> 날짜 형식으로 변환
    const createMonth = () => {
        const newDate = new moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let monthKo = new Date(newDate).toLocaleDateString('ko', { month: "short" })
        return <>{monthKo}</>
    }

    // 해당 달의 말일 구하기
    const createCircle = () => {
        const newDate = new moment(date, 'YYYY-MM-DD').format('YYYYMMDD');
        let year = newDate.substring(0, 4);
        let month = parseInt(newDate.substring(4, 6));
        let lastDate = new Date(year, month, 0);
        let lastDay = lastDate.getDate(); //
        let arr = [];
        for (let i = 1; i < lastDay + 1; i++) {
            if (habithistory[i - 1].doneYn == 0) {
                arr.push(
                    <div className="content_circle">
                        <button value={i}>{i}</button>
                    </div>
                )
            } else {
                arr.push(
                    <div className="cherryImg">
                        <button value={i} />
                    </div>
                )
            }
        }
        return arr;
    }

    // 성공 버튼
    const handlerSuccess = () => {
        const todaydate = new Date();
        console.log(new moment(todaydate, 'YYYY-MM-DD').format('YYYY-MM-DD'));

        axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/check`,
            {
                'habitIdx': habitIdx,
                'doneDt': new moment(todaydate, 'YYYY-MM-DD').format('YYYY-MM-DD')
            })
            .then(res => {
                if (res.data === 1) {
                } else {
                    swal.fire({
                        icon: 'error',
                        title: '당일에만 성공 버튼을 누를 수 있어요!',
                        showConfirmButton: '확인',
                        confirmButtonColor: '#E44A4A',
                        iconColor: '#E44A4A'
                    })
                    return;
                }
            })
            .catch(err => {
                console.log(err);
                setInsert(insert + 1);
                return;
            })
    };


    // 수정
    const [content, setContent] = useState(props.content);
    const [contentId, setContentId] = useState(props.contentId);
    const [isEditing, setIsEditing] = useState(false);

    const handlerChangeName = e => setContent(e.target.value);
    const handlerClickUpdate = () => {

        axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/edit/${habitIdx}`, { habitContent: content })
            .then(response => {
                if (response.data === 1) {
                    swal.fire({
                        icon: 'success',
                        title: '수정되었습니다',
                        showConfirmButton: '확인',
                        confirmButtonColor: '#E44A4A',
                        iconColor: '#E44A4A'
                    })
                        .then(result => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                } else {
                    swal.fire({
                        icon: 'error',
                        title: '수정에 실패했습니다',
                        showConfirmButton: '확인',
                        confirmButtonColor: '#E44A4A',
                        iconColor: '#E44A4A'
                    })
                    return;
                }
            })
            .catch(error => console.log(error));
    };

    // 기본에서 수정 버튼 눌렀을 때 보이는 페이지
    if (isEditing) {
        return (
            <div className="habit_tracker_container">
                <div className="habit_tracker_title_circle">
                    <img className="habit_tracker_title_circle_icon" src={chart}></img>
                </div>
                <h2 className="habit_tracker_title">MAKE A HABIT IN 30 DAYS!!</h2>

                <div className="habit_detail_container">

                    {/* 제목 */}
                    <div className="habit_detail_title">
                        <div className="todayMonth">{createMonth()}</div>
                        <div className="success_date">달성일 :{count}일</div>
                    </div>

                    {/* 프로그레스 바 */}
                    <div><ProgressBar percent={percent} /></div>

                    {/* 내용 */}
                    <div className="habit_detail_content_container">
                        <div className="content_title_edit_container">
                            <div className="title_edit_box">
                                <input placeholder="제목을 입력하세요" type="text" onChange={handlerChangeName} required />
                            </div>
                        </div>

                        {/* 제목이랑 내용 나누는 선 */}
                        <div className="habit_detail_content_title_line"></div>

                        {/* 날짜 원형 이미지 */}
                        <div>{createCircle()}</div>

                        {/* 저장 버튼 */}
                        <div className="savebtn_container">
                            <button className="savebtn" onClick={() => handlerClickUpdate(contentId)}>저장</button>
                        </div>
                    </div>

                    <div className="btnBox">
                        <button className="editCancelBtn" onClick={() => setIsEditing(false)}>수정 취소</button>
                        <button className="home" onClick={handlerBack}>목록으로</button>
                    </div>
                </div>

            </div>

        )
    } else {
        // 기본으로 보여지는 페이지
        return (
            <div className="habit_tracker_container">
                <div className="habit_tracker_title_circle">
                    <img className="habit_tracker_title_circle_icon" src={chart}></img>
                </div>
                <h2 className="habit_tracker_title">MAKE A HABIT IN 30 DAYS!!</h2>

                <div className="habit_detail_container">

                    {/* 제목 */}
                    <div className="habit_detail_title">
                        <div className="todayMonth">{createMonth()}</div>
                        <div className="success_date">달성일 :{count}일</div>
                    </div>

                    {/* 프로그레스 바 */}
                    <div><ProgressBar percent={percent} /></div>

                    {/* 내용 */}
                    <div className="habit_detail_content_container">
                        <div className="habit_detail_content_title">
                            <p className="habit_content_title">{habit.habitContent}</p>
                        </div>

                        {/* 제목이랑 내용 나누는 선 */}
                        <div className="habit_detail_content_title_line"></div>

                        {/* 날짜 원형 이미지 */}
                        <div>{createCircle()}</div>

                        {/* 성공 버튼 */}
                        <div className="success_container">
                            <div className="explain">버튼으로 오늘 성공 여부 확인하기!</div>
                            <MdOutlineCheckCircle className="successBtn" onClick={handlerSuccess} />
                        </div>
                    </div>

                    <div className="btnBox">
                        <button className="editBtn" onClick={() => setIsEditing(true)}>제목 수정</button>
                        <button className="home" onClick={handlerBack}>목록으로</button>
                    </div>
                </div>
            </div>

        )
    };
}
export default HabitDetail;