import ReactDOM from 'react-dom/client'
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from './store';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <Provider store={store}>
            <App />
        </Provider>
    );
} else {
    // Handle the case where the element is not found
    console.error('Failed to find the root element');
}
