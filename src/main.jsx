import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";

//Redux config
import { store } from "~/redux/store.js";
import { Provider } from "react-redux";

//Cấu hình react-router-dom
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider>
          <CssBaseline />
          <App />
          <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
);
