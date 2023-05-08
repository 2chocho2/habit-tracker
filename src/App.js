import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HabitTracker from "./habittracker/HabitTracker";
import HabitDetail from "./habitdetail/HabitDetail";
import Habitchart from "./chart/habitchart";



function App() {


  return (
    <>
      <Route path="/habitTracker" component={(props)=><HabitTracker {...props} />} exact={true} />
      <Route path="/habitDetail/:habitIdx" component={HabitDetail}/>
      <Route path="/habitChart" component={Habitchart} />
    </>
  );
}

export default App;