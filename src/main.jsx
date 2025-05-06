import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme.js";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "material-ui-confirm";
import "react-toastify/dist/ReactToastify.css";

//Redux config
import { store } from "~/redux/store.js";
import { Provider } from "react-redux";

//Cấu hình react-router-dom
import { BrowserRouter } from "react-router-dom";

//Cấu hình Redux-Persits
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);

//Kỹ thuật inject store: là kỹ thuật khi cần sử dụng redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
import { injectStore } from "~/utilities/authorizeAxios.js";
injectStore(store);

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider>
            <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
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
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
