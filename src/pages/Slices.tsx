import React, { useEffect } from 'react';

const Slices: React.FC = () => {
  useEffect(() => {
    // Add the external scripts and styles
    const addExternalResources = () => {
      // Add Tailwind CSS
      if (!document.querySelector('script[src*="tailwindcss"]')) {
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwindScript);
      }

      // Add Google Fonts
      if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'preconnect';
        fontLink.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontLink);

        const fontLink2 = document.createElement('link');
        fontLink2.rel = 'preconnect';
        fontLink2.href = 'https://fonts.gstatic.com';
        fontLink2.crossOrigin = 'anonymous';
        document.head.appendChild(fontLink2);

        const fontLink3 = document.createElement('link');
        fontLink3.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Varela+Round&display=swap';
        fontLink3.rel = 'stylesheet';
        document.head.appendChild(fontLink3);
      }

      // Add Confetti.js
      if (!document.querySelector('script[src*="confetti-js"]')) {
        const confettiScript = document.createElement('script');
        confettiScript.src = 'https://cdn.jsdelivr.net/npm/confetti-js@0.0.18/dist/index.min.js';
        document.head.appendChild(confettiScript);
      }
    };

    addExternalResources();
  }, []);

  return (
    <div className="bg-[#4a240c] flex flex-col min-h-screen p-4 text-white">
      {/* Login Page */}
      <div id="login-page" className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-md p-8 bg-[#965A2D] rounded-2xl shadow-xl text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#FFD700]" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Slices</h1>
          <p className="text-lg text-[#FFC800]" style={{ fontFamily: 'Varela Round, sans-serif' }}>Please wait while we log you in...</p>
        </div>
      </div>

      {/* Main Dashboard - Initially Hidden */}
      <div id="main-dashboard" className="hidden flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        
        {/* User Info Header */}
        <header className="w-full py-6 px-4">
          <h1 className="text-4xl font-bold text-[#FFD700] text-center md:text-left" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            Welcome, <span id="user-id"></span>
          </h1>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow flex flex-col md:flex-row items-start justify-center gap-6 w-full">
          {/* Loan Card Container */}
          <div className="max-w-sm w-full bg-[#965A2D] rounded-2xl shadow-xl overflow-hidden p-6 space-y-6 flex-shrink-0">
            
            {/* Profile Section */}
            <div className="flex flex-col items-center">
              <img src="https://placehold.co/128x128/FFD700/4a240c?text=User" alt="Profile Picture" className="w-32 h-32 rounded-full border-4 border-[#FFD700] shadow-lg" />
              <h2 className="mt-4 text-3xl font-bold text-center text-[#FFD700]" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Jane Doe</h2>
              <p className="text-sm text-[#FFC800]" style={{ fontFamily: 'Varela Round, sans-serif' }}>Personal Loan</p>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              {/* Progress Bar Container */}
              <div className="w-full h-8 bg-[#4a240c] rounded-full overflow-hidden">
                <div 
                  id="loan-progress" 
                  className="h-full rounded-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: '0%', 
                    backgroundImage: 'linear-gradient(to right, #FFD700, #FFA500)' 
                  }}
                ></div>
              </div>

              {/* Progress Text */}
              <div className="flex justify-between text-sm font-medium">
                <span id="current-amount" className="text-[#FFC800]" style={{ fontFamily: 'Varela Round, sans-serif' }}>₹0</span>
                <span id="total-amount" className="text-gray-200" style={{ fontFamily: 'Varela Round, sans-serif' }}>of ₹10,000</span>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <button 
                id="contribute-btn" 
                className="w-full py-3 px-6 bg-[#FFD700] hover:bg-[#FFA500] text-[#4a240c] font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                style={{ fontFamily: 'Varela Round, sans-serif' }}
              >
                Contribute Now
              </button>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="flex-grow max-w-lg w-full bg-[#965A2D] rounded-2xl shadow-xl p-6 space-y-4">
            <h3 className="text-2xl text-[#FFD700]" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Live Activity Feed</h3>
            <div id="activity-feed" className="space-y-2 text-[#FFC800]" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              {/* Activity messages will be added here dynamically */}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notifications Container */}
      <div className="toast-container fixed top-4 right-4 flex flex-col gap-2 z-50"></div>

      {/* Transaction Modal */}
      <div id="transaction-modal" className="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center opacity-0 invisible transition-all duration-300 ease-in-out">
        <div className="modal-card w-full max-w-sm bg-[#965A2D] rounded-2xl shadow-xl p-8 space-y-6 text-center transform translate-y-full transition-transform duration-500 ease-in-out">
          <h2 id="modal-title" className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Processing...</h2>
          
          {/* Modal Progress Bar */}
          <div className="w-full h-4 bg-[#4a240c] rounded-full overflow-hidden">
            <div 
              id="modal-progress" 
              className="h-full rounded-full transition-all duration-1000 ease-in-out" 
              style={{ 
                width: '0%', 
                backgroundImage: 'linear-gradient(to right, #FFD700, #FFA500)' 
              }}
            ></div>
          </div>

          <p id="modal-message" className="text-sm text-[#FFC800]" style={{ fontFamily: 'Varela Round, sans-serif' }}>Your transaction is being processed.</p>
          
          <button 
            id="close-modal-btn" 
            className="hidden w-full py-3 px-6 bg-[#FFD700] hover:bg-[#FFA500] text-[#4a240c] font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{ fontFamily: 'Varela Round, sans-serif' }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Confetti and Animation Container */}
      <canvas id="confetti-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"></canvas>

      <style jsx>{`
        .modal.open {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .modal.open .modal-card {
          transform: translateY(0) !important;
        }
        .toast {
          animation: slideInRight 0.5s forwards, fadeOut 0.5s 2.5s forwards;
          opacity: 0;
          transform: translateX(100%);
        }
        @keyframes slideInRight {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const contributeBtn = document.getElementById('contribute-btn');
            const modal = document.getElementById('transaction-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalProgress = document.getElementById('modal-progress');
            const modalMessage = document.getElementById('modal-message');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const activityFeed = document.getElementById('activity-feed');
            const toastContainer = document.querySelector('.toast-container');

            // Initialize confetti when available
            let confetti = null;
            if (window.ConfettiGenerator) {
              const confettiSettings = { target: 'confetti-canvas' };
              confetti = new window.ConfettiGenerator(confettiSettings);
            }

            const activityMessageColors = ['bg-[#FFC800]/20', 'bg-[#FFA500]/20', 'bg-[#FFD700]/20'];
            const toastColors = ['bg-[#FFC800]', 'bg-[#FFA500]', 'bg-[#FFD700]'];

            // Function to add a message to the activity feed
            window.addActivityMessage = (message, type = 'contribution') => {
              const messageEl = document.createElement('div');
              messageEl.className = 'p-3 rounded-xl shadow-inner';
              if (type === 'completion') {
                messageEl.classList.add('bg-[#FFD700]/20', 'text-white', 'font-bold');
              } else {
                const randomColor = activityMessageColors[Math.floor(Math.random() * activityMessageColors.length)];
                messageEl.classList.add(randomColor);
              }
              messageEl.textContent = message;
              activityFeed.prepend(messageEl);
            };

            // Function to show a toast notification
            window.showToast = (message, type = 'contribution') => {
              const toastEl = document.createElement('div');
              toastEl.className = 'toast py-3 px-6 rounded-full shadow-lg text-sm font-semibold';
              if (type === 'completion') {
                toastEl.classList.add('bg-[#FFA500]', 'text-[#4a240c]');
              } else {
                const randomColor = toastColors[Math.floor(Math.random() * toastColors.length)];
                toastEl.classList.add(randomColor, 'text-[#4a240c]');
              }
              toastEl.textContent = message;
              toastContainer.appendChild(toastEl);
              setTimeout(() => toastEl.remove(), 3000);
            };
            
            // Modal functionality
            contributeBtn.addEventListener('click', async () => {
              modal.classList.add('open');
              modalTitle.textContent = 'Processing...';
              modalProgress.style.width = '0%';
              modalMessage.textContent = 'Your transaction is being processed.';
              closeModalBtn.classList.add('hidden');

              // Simulate transaction progress
              let transactionProgress = 0;
              const transactionInterval = setInterval(() => {
                transactionProgress += 10;
                modalProgress.style.width = transactionProgress + '%';
                if (transactionProgress >= 100) {
                  clearInterval(transactionInterval);
                  modalTitle.textContent = 'Success!';
                  modalMessage.textContent = 'Your contribution has been added.';
                  closeModalBtn.classList.remove('hidden');

                  // Trigger confetti on success
                  if (confetti) {
                    confetti.render();
                    setTimeout(() => {
                       confetti.clear();
                    }, 5000);
                  }
                }
              }, 100);

              // Simulate adding contribution
              setTimeout(() => {
                const currentAmount = parseInt(document.getElementById('current-amount').textContent.replace('₹', '').replace(',', ''));
                const newAmount = currentAmount + 100;
                document.getElementById('current-amount').textContent = '₹' + newAmount.toLocaleString();
                document.getElementById('loan-progress').style.width = (newAmount / 10000 * 100) + '%';
                window.addActivityMessage('User contributed ₹100.');
                window.showToast('New Contribution: ₹100');
              }, 1000);
            });

            closeModalBtn.addEventListener('click', () => {
              modal.classList.remove('open');
            });

            modal.addEventListener('click', (e) => {
              if (e.target.id === 'transaction-modal') {
                modal.classList.remove('open');
              }
            });

            // Simulate login
            setTimeout(() => {
              document.getElementById('login-page').classList.add('hidden');
              document.getElementById('main-dashboard').classList.remove('hidden');
              document.getElementById('user-id').textContent = 'User-1234';
            }, 2000);
          });
        `
      }} />
    </div>
  );
};

export default Slices;

