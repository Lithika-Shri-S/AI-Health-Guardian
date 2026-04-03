document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const activeUser = JSON.parse(localStorage.getItem('healthGuardActiveUser'));
    if (!activeUser) {
        window.location.href = 'login.html';
        return;
    }

    const API_BASE = 'http://127.0.0.1:5000/api';

    // Elements
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const chatWindow = document.getElementById('chatWindow');
    const simulateEmergencyBtn = document.getElementById('simulateEmergencyBtn');
    const alertBanner = document.getElementById('alertBanner');
    const alertText = document.getElementById('alertText');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const heartRateEl = document.getElementById('heartRate');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    // Update user profile name and details
    function updateUserUI() {
        if (userNameDisplay) userNameDisplay.textContent = activeUser.name;
        const avatarUrl = activeUser.avatar || "https://i.pravatar.cc/150?img=32";
        const avatarDisplay = document.getElementById('userAvatarDisplay');
        const settingsAvatarPreview = document.getElementById('settingsAvatarPreview');
        if (avatarDisplay) avatarDisplay.src = avatarUrl;
        if (settingsAvatarPreview) settingsAvatarPreview.src = avatarUrl;
        
        // Hydrate settings form
        if (document.getElementById('settingsName')) document.getElementById('settingsName').value = activeUser.name || '';
        if (document.getElementById('settingsPhone')) document.getElementById('settingsPhone').value = activeUser.phone || '';
    }
    updateUserUI();

    // Logout handling
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('healthGuardActiveUser');
            window.location.href = 'login.html';
        });
    }
    
    // Check Health of Backend
    fetch(`${API_BASE}/health`)
        .then(r => r.json())
        .then(data => console.log("Backend status:", data))
        .catch(err => console.log("Backend not running yet, using mocks.", err));

    // Chat functionality
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function sendSymptom() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        try {
            const response = await fetch(`${API_BASE}/symptom-checker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: text })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            if (data.analysis) {
                addMessage(data.analysis, 'ai');
            }
        } catch (e) {
            console.warn("Backend not running, using offline fallback response.");
            // Offline fallback response based on keywords
            setTimeout(() => {
                const lowerText = text.toLowerCase();
                let reply = "I have noted your symptoms. Please monitor them closely. If they worsen, consider consulting a healthcare professional.";
                
                if (lowerText.includes('headache') || lowerText.includes('fever')) {
                    reply = "Based on your symptoms (headache/fever), it is possible you are experiencing a viral infection or flu. Rest, stay hydrated, and monitor your temperature.";
                } else if (lowerText.includes('chest') || lowerText.includes('pain')) {
                    reply = "Chest pain can be a sign of a serious medical emergency, such as a heart attack. Please seek immediate medical attention or call emergency services.";
                } else if (lowerText.includes('dizzy') || lowerText.includes('dizziness') || lowerText.includes('woozy')) {
                    reply = "Dizziness or feeling woozy can be caused by dehydration, low blood sugar, or more serious conditions. Please drink some water, sit down immediately, and avoid sudden movements.";
                } else if (lowerText.includes('overdose') || lowerText.includes('poison') || lowerText.includes('suicide')) {
                    reply = "🚨 CRITICAL WARNING: An overdose is a life-threatening medical emergency. Please call your local emergency hotline (e.g., 911) or Poison Control IMMEDIATELY. Do not wait.";
                } else if (lowerText.includes('tablet') || lowerText.includes('medicine') || lowerText.includes('pill') || lowerText.includes('antidepressant')) {
                    reply = "As an AI, I cannot prescribe medication. However, you can use the Med Scanner tool on the left to identify your medicine and verify its intended usage.";
                } else if (lowerText.includes('nausea') || lowerText.includes('stomach')) {
                    reply = "Stomach pain and nausea could indicate food poisoning or a gastrointestinal issue. Eat light, bland foods and stay hydrated. Seek help if symptoms are severe.";
                }
                
                addMessage(reply + " (Offline Mode)", 'ai');
            }, 600);
        }
    }

    sendBtn.addEventListener('click', sendSymptom);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendSymptom();
    });

    // Voice functionality (Web Speech API)
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            voiceBtn.style.color = '#EF4444'; // turn red while listening
        };

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            chatInput.value = transcript;
            sendSymptom();
        };

        recognition.onend = () => {
            voiceBtn.style.color = 'white';
        };

        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceBtn.style.display = 'none'; // hide if not supported
    }

    // Emergency Simulation
    simulateEmergencyBtn.addEventListener('click', async () => {
        // Change UI vital sign temporarily
        heartRateEl.innerHTML = `145 <small>bpm</small>`;
        heartRateEl.style.color = 'var(--danger)';
        
        try {
            const response = await fetch(`${API_BASE}/emergency`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: activeUser.name,
                    vitals: { heart_rate: 145, oxygen_level: 92, temperature: 99.1 }
                })
            });
            
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            if (data.severity === "CRITICAL") {
                showAlert(data.message);
                addMessage("🚨 " + data.message, "ai");
            }
        } catch(e) {
            console.warn("Backend not running, using offline fallback response.");
            const phoneInfo = activeUser.phone ? ` to ${activeUser.phone}` : '';
            showAlert(`CRITICAL: Heart Rate Spike Detected! Auto-alerting emergency contacts via SMS${phoneInfo} (Offline Mocked).`);
            addMessage("🚨 Patient " + activeUser.name + " has critical heart rate: 145 bpm. (Offline Mode)", "ai");
        }
        
        // Reset vital sign after 5 seconds
        setTimeout(() => {
            heartRateEl.innerHTML = `72 <small>bpm</small>`;
            heartRateEl.style.color = 'var(--secondary)';
        }, 5000);
    });

    function showAlert(msg) {
        alertText.textContent = msg;
        alertBanner.classList.remove('hidden');
        
        setTimeout(() => {
            alertBanner.classList.add('hidden');
        }, 5000);
    }

    // Navigation and Settings Logic
    const dashboardView = document.getElementById('dashboardView');
    const settingsView = document.getElementById('settingsView');
    const medScannerView = document.getElementById('medScannerView');
    const pageTitle = document.getElementById('pageTitle');
    
    function hideAllViews() {
        if(dashboardView) dashboardView.classList.add('hidden-view');
        if(settingsView) settingsView.classList.add('hidden-view');
        if(medScannerView) medScannerView.classList.add('hidden-view');
        document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
    }

    if (document.getElementById('navDashboard')) {
        document.getElementById('navDashboard').addEventListener('click', (e) => {
            hideAllViews();
            e.currentTarget.classList.add('active');
            dashboardView.classList.remove('hidden-view');
            pageTitle.textContent = "Patient Dashboard";
        });
    }

    if (document.getElementById('navSymptomCheck')) {
        document.getElementById('navSymptomCheck').addEventListener('click', (e) => {
            hideAllViews();
            e.currentTarget.classList.add('active');
            dashboardView.classList.remove('hidden-view');
            pageTitle.textContent = "Symptom Checker Checkpoint";
            chatInput.focus();
        });
    }

    if (document.getElementById('navMedScanner')) {
        document.getElementById('navMedScanner').addEventListener('click', (e) => {
            hideAllViews();
            e.currentTarget.classList.add('active');
            medScannerView.classList.remove('hidden-view');
            pageTitle.textContent = "Medicine Scanner";
        });
    }

    if (document.getElementById('navSettings')) {
        document.getElementById('navSettings').addEventListener('click', (e) => {
            hideAllViews();
            e.currentTarget.classList.add('active');
            settingsView.classList.remove('hidden-view');
            pageTitle.textContent = "Settings";
        });
    }

    let pendingAvatarUrl = activeUser.avatar || '';
    const settingsAvatarFile = document.getElementById('settingsAvatarFile');
    const settingsAvatarPreview = document.getElementById('settingsAvatarPreview');
    
    if (settingsAvatarFile) {
        settingsAvatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    pendingAvatarUrl = evt.target.result;
                    if (settingsAvatarPreview) settingsAvatarPreview.src = pendingAvatarUrl;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            activeUser.name = document.getElementById('settingsName').value;
            activeUser.avatar = pendingAvatarUrl;
            activeUser.phone = document.getElementById('settingsPhone').value;
            
            // Save to active user
            localStorage.setItem('healthGuardActiveUser', JSON.stringify(activeUser));
            
            // Save to users array
            let users = JSON.parse(localStorage.getItem('healthGuardUsers')) || [];
            users = users.map(u => u.email === activeUser.email ? activeUser : u);
            localStorage.setItem('healthGuardUsers', JSON.stringify(users));
            
            updateUserUI(); // Reflect changes immediately
            
            const successMsg = document.getElementById('settingsSuccess');
            successMsg.classList.remove('hidden-view');
            setTimeout(() => { successMsg.classList.add('hidden-view'); }, 3000);
        });
    }

    // Med Scanner Upload Logic
    const medImageInput = document.getElementById('medImageInput');
    const medPreview = document.getElementById('medPreview');
    const scanningOverlay = document.getElementById('scanningOverlay');
    const medResult = document.getElementById('medResult');

    if (medImageInput) {
        medImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Ensure UI resets
                medResult.classList.add('hidden-view');
                scanningOverlay.style.display = 'flex';
                
                const reader = new FileReader();
                reader.onload = (evt) => {
                    medPreview.src = evt.target.result;
                    medPreview.style.display = 'block';
                    
                    // Simulate AI processing delay
                    setTimeout(() => {
                        scanningOverlay.style.display = 'none';
                        medResult.classList.remove('hidden-view');
                    }, 2500);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
