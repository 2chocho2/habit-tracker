import { Route } from "react-router-dom/cjs/react-router-dom.min";
import HabitTracker from "./habittracker/HabitTracker";
import HabitDetail from "./habitdetail/HabitDetail";

function App() {

  return (
    <>
      <Route path="/" component={(props)=><HabitTracker {...props} />} exact={true} />
      <Route path="/habitDetail/:habitIdx" component={HabitDetail}/>
    </>
  );
}

export default App;