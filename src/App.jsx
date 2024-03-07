import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
//
import FormulaEditor from "./components/FormulaEditor/FormulaEditor";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <FormulaEditor />
        <h1 className="text-3xl font-bold underline">Hello world!</h1>{" "}
      </div>
    </QueryClientProvider>
  );
}

export default App;
