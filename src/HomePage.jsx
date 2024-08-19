import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function HomePage({ onStartChat, chatHistory, onResumeChat, chatCounts }) {
  // Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(chatCounts),
    datasets: [
      {
        label: 'Chats Per Day',
        data: Object.values(chatCounts),
        backgroundColor: '#4e73df',
        borderColor: '#2e59d9',
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Chats',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Chat</h1>
      <div className = "start-chat">
        <button onClick={onStartChat}>Start New Chat</button>
      </div>
      <div className="content-container">
        <div className="chart-container">
          <h2>Chats Per Day</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="chat-history-container">
          <h2>Chat History</h2>
          {chatHistory.length > 0 ? (
            <ul>
              {chatHistory.map((chat) => (
                <div className = "history-button">
                  <button onClick={() => onResumeChat(chat)}>
                    Chat from {chat.timestamp}
                  </button>
                </div>
              ))}
            </ul>
          ) : (
            <p>No previous chats available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
