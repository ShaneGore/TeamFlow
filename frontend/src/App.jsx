import { Board } from './components/Board.jsx';

export function App() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>TeamFlow</h1>
          <p>One shared Kanban board for a small team.</p>
        </div>
        <span className="mode-pill">To Do · In Progress · Done</span>
      </header>
      <main className="main">
        <Board />
      </main>
    </div>
  );
}
