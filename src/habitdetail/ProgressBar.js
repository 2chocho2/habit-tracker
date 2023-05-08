import { useState } from "react";
import styled from "styled-components";
import cherry1 from "./cherry1.png"
import cherry22 from "./cherry22.png"
import cherry3 from "./cherry3.png"


const ProgressBar = () => {

    const [count , setCount] = useState(0);

    function addCount() {
        if (count === 5) {
            setCount(0);
        } else {
            setCount(count + 1);
        }
    }

  return (
        <Container className="gage_bar" onClick={() => {addCount()}}>
            <Progress className="gage_percent" width={(count/5)*100 + "%"}/>
            <Cherry1/>
            {/* <Cherry2/> */}
            {/* <Cherry3/> */}
        </Container>
  );
}

export default ProgressBar;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 900px;
  height: 50px;
  border: 4px solid #E44A4A;
  border-radius: 30px;
  margin-top: 40px;
  margin-left: 220px;
  background-color: #FFF8DD;
`;
const Progress = styled.div`
  background-color: #fd9a9a;
  width: ${props => props.width};
  height: 100%;
  transition: width 1s;
  border-radius: 30px;
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
  margin-left: -58px;
`
const Cherry3 = styled.div`
  width: 80px;
  height: 80px;
  background-image: url(${cherry3});
  margin-left: -85px;
`