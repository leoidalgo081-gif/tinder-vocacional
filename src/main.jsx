import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MonitorView from './MonitorView.jsx'
import TrackingView from './TrackingView.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', background: 'red', padding: '2rem', height: '100vh', width: '100vw' }}>
          <h1>Algo deu errado:</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const hash = window.location.hash;
let ActiveView = App;
if (hash === '#monitor') ActiveView = MonitorView;
if (hash === '#acompanhamento') ActiveView = TrackingView;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ActiveView />
    </ErrorBoundary>
  </StrictMode>,
)
