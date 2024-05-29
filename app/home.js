import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "../components/Home/Home";
import HelpButton from "../components/HelpButton";
import Carousel from "../components/CarouselOne/Carousel";

const App = () => (
  <GestureHandlerRootView style={{ flex: 1,  backgroundColor: "#FCF8E3" }}>
    <SafeAreaProvider>
      <HelpButton />
      <Home />
      {/* <Carousel /> */}
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;
