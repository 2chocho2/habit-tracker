import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import cherry1 from "../img/cherry1.png"
import cherry22 from "../img/cherry22.png"
import cherry3 from "../img/cherry3.png"
import axios from "axios";

const ProgressBar = ({ percent }) => {

  const [progressPercent, setProgressPercent] = useState(0);
  const { habitIdx } = useParams();

  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/api/habit/detail/${habitIdx}`)
      .then(response => {
        setProgressPercent(response.data.percent);
      })
      .catch(error => console.log(error));
  }, [percent]);

  const progressImg = () => {
    if (progressPercent < 30) {
      return <Cherry1 />
    } else if (progressPercent >= 30 && progressPercent < 60) {
      return <Cherry2 />
    } else {
      return <Cherry3 />
    };
  }

  return (
    <Container>
      <Progress width={(percent / 100) * 100 + "%"} />
      {progressImg()}
      <Percent>{progressPercent}%</Percent>
    </Container>
  );
}

export default ProgressBar;

const Container = styled.div`
  display: flex;
  width: 60%;
  height: 50px;
  border: 3px solid #E44A4A;
  border-radius: 30px;
  background-color: #FFF8DD;
  margin: 40px auto;

`;
const Progress = styled.div`
  background-color: #fd9a9a;
  width: ${props => props.width};
  height: 100%;
  transition: width 1s;
  border-radius: 30px;
`;
const Percent = styled.div`
  height: 100%;
  font-size: 20px;
  margin-left: -110px;
  margin-top: 12px;
  color: #FFF8DD;
`;

//프로그레스 바에 원 달아서 프로그레스 바가 차오를 때 같이 차오름
const Cherry1 = styled.div`
  width: 56px;
  height: 49px;
  background-image: url(${cherry1});
  margin-left: -60px;
`
const Cherry2 = styled.div`
  width: 54px;
  height: 73px;
  background-image: url(${cherry22});
  margin-left: -60px;
  margin-top: -11px;
`
const Cherry3 = styled.div`
  width: 70px;
  height: 70px;
  background-image: url(${cherry3});
  margin-left: -80px;
  margin-top: -17px;
`