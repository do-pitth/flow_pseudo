// Gamified Online Lesson Engine - Flowchart & Pseudo Code Adventure
let selectedHero = null;
let currentScorePool = 0; // Cumulative core score
let activeQuestionIndex = 0; // 0 to 9 index tracker
let currentQPotentialScore = 100; // Drops by 10 per failure
let activeSessionQuestions = []; 
let workspaceSlotsData = []; // State of currently placed blocks in workspace slots
let selectedPaletteBlockIndex = null; // Click-to-place buffer

// Exhaustive robust pool of scenario based items
const QUESTION_BANK = {
    sequence: [
        {
            title: "คำนวณพื้นที่สี่เหลี่ยมผืนผ้า",
            type: "Sequence",
            correctOrder: ["เริ่มต้น", "รับค่าความกว้าง W", "รับค่าความยาว L", "คำนวณ Area = W * L", "แสดงผลลัพธ์ Area", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#a9e34b", "#ffd43b", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับค่าความกว้าง W": "INPUT W",
                "รับค่าความยาว L": "INPUT L",
                "คำนวณ Area = W * L": "Area = W * L",
                "แสดงผลลัพธ์ Area": "OUTPUT Area",
                "สิ้นสุด": ""
            }
        },
        {
            title: "คำนวณราคาสินค้ารวมภาษีกระบวนการเรียงลำดับ",
            type: "Sequence",
            correctOrder: ["เริ่มต้น", "รับราคาสินค้า Price", "คำนวณ Total = Price * 1.07", "แสดงราคาสุทธิ Total", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ffd43b", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับราคาสินค้า Price": "INPUT Price",
                "คำนวณ Total = Price * 1.07": "Total = Price * 1.07",
                "แสดงราคาสุทธิ Total": "OUTPUT Total",
                "สิ้นสุด": ""
            }
        },
        {
            title: "หาค่าเฉลี่ยคะแนนสะสม 3 วิชา",
            type: "Sequence",
            correctOrder: ["เริ่มต้น", "รับคะแนน A, B, C", "คำนวณ Avg = (A+B+C)/3", "แสดงผลค่าเฉลี่ย Avg", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ffd43b", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับคะแนน A, B, C": "INPUT A, B, C",
                "คำนวณ Avg = (A+B+C)/3": "Avg = (A + B + c) / 3",
                "แสดงผลค่าเฉลี่ย Avg": "OUTPUT Avg",
                "สิ้นสุด": ""
            }
        },
        {
            title: "คำนวณอายุจากปี พ.ศ. เกิด",
            type: "Sequence",
            correctOrder: ["เริ่มต้น", "รับปีเกิด birthYear", "คำนวณ age = 2569 - birthYear", "แสดงผลลัพธ์ age", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ffd43b", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับปีเกิด birthYear": "INPUT birthYear",
                "คำนวณ age = 2569 - birthYear": "age = 2569 - birthYear",
                "แสดงผลลัพธ์ age": "OUTPUT age",
                "สิ้นสุด": ""
            }
        },
        {
            title: "แปลงหน่วยเซนติเมตรเป็นนิ้ว",
            type: "Sequence",
            correctOrder: ["เริ่มต้น", "รับค่าเซนติเมตร CM", "คำนวณ Inch = CM / 2.54", "แสดงผลค่านิ้ว Inch", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ffd43b", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับค่าเซนติเมตร CM": "INPUT CM",
                "คำนวณ Inch = CM / 2.54": "Inch = CM / 2.54",
                "แสดงผลค่านิ้ว Inch": "OUTPUT Inch",
                "สิ้นสุด": ""
            }
        }
    ],
    selection: [
        {
            title: "ระบบตรวจผลคะแนนสอบเข้ามหาวิทยาลัย",
            type: "Selection",
            correctOrder: ["เริ่มต้น", "รับค่าคะแนน Score", "ตรวจสอบ Score >= 50", "แสดงผลว่า ผ่าน", "แสดงผลว่า ไม่ผ่าน", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ff8787", "#da77f2", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับค่าคะแนน Score": "INPUT Score",
                "ตรวจสอบ Score >= 50": "IF Score >= 50 THEN",
                "แสดงผลว่า ผ่าน": "  OUTPUT 'Pass'",
                "แสดงผลว่า ไม่ผ่าน": "ELSE OUTPUT 'Fail'\nENDIF",
                "สิ้นสุด": ""
            }
        },
        {
            title: "ตรวจสอบคุณสมบัติสิทธิ์เลือกตั้ง",
            type: "Selection",
            correctOrder: ["เริ่มต้น", "รับค่าอายุ Age", "ตรวจสอบ Age >= 18", "แสดงสิทธิ์ เลือกตั้งได้", "แสดงสิทธิ์ ไม่มีสิทธิ์", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ff8787", "#da77f2", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับค่าอายุ Age": "INPUT Age",
                "ตรวจสอบ Age >= 18": "IF Age >= 18 THEN",
                "แสดงสิทธิ์ เลือกตั้งได้": "  OUTPUT 'Eligible'",
                "แสดงสิทธิ์ ไม่มีสิทธิ์": "ELSE OUTPUT 'Ineligible'\nENDIF",
                "สิ้นสุด": ""
            }
        },
        {
            title: "ระบบคัดกรองอุณหภูมิร่างกายป้องกันโรค",
            type: "Selection",
            correctOrder: ["เริ่มต้น", "รับค่าอุณหภูมิ Temp", "ตรวจสอบ Temp > 37.5", "แสดงแจ้งเตือน เป็นไข้", "แสดงแจ้งเตือน อุณหภูมิปกติ", "สิ้นสุด"],
            colors: ["#4dabf7", "#a9e34b", "#ff8787", "#da77f2", "#da77f2", "#4dabf7"],
            pseudoMapping: {
                "เริ่มต้น": "",
                "รับค่าอุณหภูมิ Temp": "INPUT Temp",
                "ตรวจสอบ Temp > 37.5": "IF Temp > 37.5 THEN",
                "แสดงแจ้งเตือน เป็นไข้": "  OUTPUT 'Fever'",
                "แสดงแจ้งเตือน อุณหภูมิปกติ": "ELSE OUTPUT 'Normal'\nENDIF",
                "สิ้นสุด": ""
            }
        }
    ],
    iteration: [
        {
            title: "โปรแกรมวนซ้ำพิมพ์ข้อความสำเร็จ 5 รอบ",
            type: "Iteration",
            correctOrder: ["กำหนดตัวนับ i = 1", "ตรวจสอบเงื่อนไข i <= 5", "แสดงผลคำว่า Hello", "เพิ่มค่าตัวนับ i = i + 1", "สิ้นสุดลูปกระบวนการ"],
            colors: ["#ffd43b", "#ff8787", "#da77f2", "#ffd43b", "#4dabf7"],
            pseudoMapping: {
                "กำหนดตัวนับ i = 1": "FOR i = 1 TO 5",
                "ตรวจสอบเงื่อนไข i <= 5": "",
                "แสดงผลคำว่า Hello": "  OUTPUT 'Hello'",
                "เพิ่มค่าตัวนับ i = i + 1": "NEXT i",
                "สิ้นสุดลูปกระบวนการ": ""
            }
        },
        {
            title: "คำนวณหาผลรวมสะสมเลข 1 ถึง 10",
            type: "Iteration",
            correctOrder: ["กำหนด Sum = 0, i = 1", "ตรวจสอบลูป i <= 10", "คำนวณสะสม Sum = Sum + i", "เพิ่มค่า i = i + 1", "แสดงผลรวมสุดท้าย Sum"],
            colors: ["#ffd43b", "#ff8787", "#ffd43b", "#ffd43b", "#da77f2"],
            pseudoMapping: {
                "กำหนด Sum = 0, i = 1": "Sum = 0\nWHILE i <= 10",
                "ตรวจสอบลูป i <= 10": "",
                "คำนวณสะสม Sum = Sum + i": "  Sum = Sum + i",
                "เพิ่มค่า i = i + 1": "  i = i + 1\nENDWHILE",
                "แสดงผลรวมสุดท้าย Sum": "OUTPUT Sum"
            }
        }
    ]
};

// Handle Navigation Routing
function navigateTo(pageNumber) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active-page'));
    const target = document.getElementById(`page-${pageNumber}`);
    if (target) target.classList.add('active-page');

    const headerStats = document.getElementById('game-stats-header');
    if (pageNumber === 7) {
        headerStats.style.display = 'flex';
    } else {
        headerStats.style.display = 'none';
    }
}

// Select Avatar Hero Character
function chooseAvatar(type) {
    selectedHero = type;
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected-hero'));
    document.getElementById(`avatar-${type}-select`).classList.add('selected-hero');
    
    const startBtn = document.getElementById('start-game-btn');
    startBtn.classList.remove('disabled');
    startBtn.removeAttribute('disabled');
}

// Generate Selected Questions Array (5 Seq, 3 Sel, 2 Iter)
function startGamifiedTest() {
    // Collect specific amounts from each category
    let seqSelected = shuffleArray([...QUESTION_BANK.sequence]).slice(0, 5);
    let selSelected = shuffleArray([...QUESTION_BANK.selection]).slice(0, 3);
    let iterSelected = shuffleArray([...QUESTION_BANK.iteration]).slice(0, 2);

    // Merge and form total test set
    activeSessionQuestions = [...seqSelected, ...selSelected, ...iterSelected];
    
    currentScorePool = 0;
    activeQuestionIndex = 0;
    
    document.getElementById('header-total-score').innerText = currentScorePool;
    loadQuizQuestion(activeQuestionIndex);
    navigateTo(7);
}

// Load current item data to UI
function loadQuizQuestion(index) {
    if (index >= activeSessionQuestions.length) {
        renderFinalSummaryView();
        return;
    }

    currentQPotentialScore = 100;
    selectedPaletteBlockIndex = null;
    const currentQuestion = activeSessionQuestions[index];
    
    // Header UI counters
    document.getElementById('header-q-progress').innerText = `${index + 1}/10`;
    document.getElementById('current-mission-type').innerText = currentQuestion.type;
    document.getElementById('current-mission-title').innerText = `โจทย์สถานการณ์ปัญหา: ${currentQuestion.title}`;
    document.getElementById('question-potential-score').innerText = currentQPotentialScore;

    // Render original available blocks options shuffled
    let scrambledBlocks = shuffleArray(currentQuestion.correctOrder.map((text, i) => {
        // preserve correct color styling matching item
        let originalIdx = currentQuestion.correctOrder.indexOf(text);
        return { text: text, color: currentQuestion.colors[originalIdx] };
    }));

    renderPaletteList(scrambledBlocks);

    // Clear and construct target placeholders slots on workspace canvas
    workspaceSlotsData = new Array(currentQuestion.correctOrder.length).fill(null);
    renderWorkspaceCanvasSlots();
    
    // Draw default avatar status
    renderAvatarState('neutral');
    updateRealtimePseudoCodeText();
}

function renderPaletteList(blocks) {
    const paletteBox = document.getElementById('blocks-palette-list');
    paletteBox.innerHTML = '';
    
    blocks.forEach((b, i) => {
        const item = document.createElement('div');
        item.className = 'game-drag-block animate__animated animate__fadeInUp';
        item.style.backgroundColor = b.color;
        // Text readability check
        if(b.color === "#ffd43b" || b.color === "#a9e34b") item.style.color = "#111";
        item.innerText = b.text;
        
        item.onclick = () => {
            // Click to select mechanism
            document.querySelectorAll('.game-drag-block').forEach(el => el.classList.remove('selected-for-move'));
            selectedPaletteBlockIndex = b;
            item.classList.add('selected-for-move');
            document.getElementById('avatar-feedback-msg').innerText = `คุณเลือก "${b.text}" แล้ว! ต่อไปให้คลิกช่องสี่เหลี่ยมในพื้นที่คำตอบที่ต้องการวางได้เลยครับ`;
        };
        
        paletteBox.appendChild(item);
    });
}

function renderWorkspaceCanvasSlots() {
    const area = document.getElementById('flowchart-drop-area');
    area.innerHTML = '';
    
    workspaceSlotsData.forEach((slotData, i) => {
        const slot = document.createElement('div');
        slot.className = 'canvas-interactive-slot';
        if (slotData) {
            slot.classList.add('filled-slot');
            slot.style.backgroundColor = slotData.color;
            if(slotData.color === "#ffd43b" || slotData.color === "#a9e34b") slot.style.color = "#111";
            slot.style.fontWeight = "600";
            slot.innerText = slotData.text;
            
            // Add click to remove item option
            const rmBtn = document.createElement('span');
            rmBtn.innerHTML = ' &times;';
            rmBtn.style.color = 'red';
            rmBtn.style.marginLeft = '12px';
            rmBtn.style.cursor = 'pointer';
            rmBtn.onclick = (e) => {
                e.stopPropagation();
                workspaceSlotsData[i] = null;
                renderWorkspaceCanvasSlots();
                updateRealtimePseudoCodeText();
            };
            slot.appendChild(rmBtn);
        } else {
            slot.innerHTML = `<span style="color:#94a3b8; font-size:9.5pt;"><i class="fa-solid fa-plus"></i> ช่องขั้นตอนลำดับที่ ${i + 1} (คลิกเพื่อวางข้อมูล)</span>`;
        }
        
        slot.onclick = () => {
            if (selectedPaletteBlockIndex) {
                workspaceSlotsData[i] = selectedPaletteBlockIndex;
                selectedPaletteBlockIndex = null;
                document.querySelectorAll('.game-drag-block').forEach(el => el.classList.remove('selected-for-move'));
                renderWorkspaceCanvasSlots();
                updateRealtimePseudoCodeText();
            }
        };
        
        area.appendChild(slot);
    });
}

// Process Realtime Pseudo Code rendering matching current slots sequence state
function updateRealtimePseudoCodeText() {
    const container = document.getElementById('realtime-pseudo-lines');
    container.innerHTML = '';
    
    let activeElementsCount = 0;
    const currentQuestion = activeSessionQuestions[activeQuestionIndex];

    workspaceSlotsData.forEach((slot) => {
        if (slot && currentQuestion.pseudoMapping[slot.text]) {
            activeElementsCount++;
            let codeLineText = currentQuestion.pseudoMapping[slot.text];
            
            const lineWrap = document.createElement('div');
            lineWrap.style.margin = '3px 0';
            // convert linebreaks
            lineWrap.innerHTML = codeLineText.replace(/\n/g, '<br>');
            container.appendChild(lineWrap);
        }
    });

    if (activeElementsCount === 0) {
        container.innerHTML = '<span class="pseudo-placeholder">// โปรดเพิ่มบล็อกสัญลักษณ์เพื่อจำลองรหัสเทียม...</span>';
    }
}

// Submit Answer Evaluation Mechanism
function submitCurrentAnswer() {
    const currentQuestion = activeSessionQuestions[activeQuestionIndex];
    
    // Check if slots are fully filled
    let containsEmpty = workspaceSlotsData.some(s => s === null);
    if (containsEmpty) {
        alert("กรุณาเติมบล็อกสัญลักษณ์ลงในช่องลำดับผังงานให้ครบถ้วนก่อนส่งยืนยันตรรกะครับ!");
        return;
    }

    // Evaluate exact array equality
    let isFullyCorrect = true;
    for (let i = 0; i < currentQuestion.correctOrder.length; i++) {
        if (workspaceSlotsData[i].text !== currentQuestion.correctOrder[i]) {
            isFullyCorrect = false;
            break;
        }
    }

    if (isFullyCorrect) {
        // Success execution
        document.getElementById('snd-correct').play().catch(()=>{});
        renderAvatarState('happy');
        
        currentScorePool += currentQPotentialScore;
        document.getElementById('header-total-score').innerText = currentScorePool;
        
        document.getElementById('avatar-feedback-msg').innerText = `ยินดีด้วย คุณได้รับ ${currentQPotentialScore} คะแนน!`;
        alert(`ยินดีด้วย คุณได้ ${currentQPotentialScore} คะแนน`);
        
        // Push payload data asynchronously via Google sheets framework simulation
        simulateGoogleSheetsPush(currentQuestion.title, currentQPotentialScore);

        activeQuestionIndex++;
        setTimeout(() => {
            loadQuizQuestion(activeQuestionIndex);
        }, 1400);

    } else {
        // Failure deduction execution
        document.getElementById('snd-wrong').play().catch(()=>{});
        currentQPotentialScore -= 10;
        document.getElementById('question-potential-score').innerText = currentQPotentialScore;

        if (currentQPotentialScore <= 0) {
            renderAvatarState('sad');
            document.getElementById('avatar-feedback-msg').innerText = "เสียใจด้วยนะ คุณทำไม่ถูกต้องในภารกิจนี้ ระบบจะนำทางไปข้อถัดไป";
            alert("เสียใจด้วยนะ คุณทำไม่ถูกต้อง");
            
            simulateGoogleSheetsPush(currentQuestion.title, 0);
            activeQuestionIndex++;
            setTimeout(() => {
                loadQuizQuestion(activeQuestionIndex);
            }, 1400);
        } else {
            renderAvatarState('sad');
            document.getElementById('avatar-feedback-msg').innerText = "อาจจะยังน้า มีจุดตรรกะสลับที่อยู่ ลองปรับทิศทางใหม่ดูนะผู้กล้า!";
        }
    }
}

// Core Vector SVG Graphic Renderer Mapping Mood Engine States
function renderAvatarState(mood) {
    const container = document.getElementById('live-avatar-mood-container');
    let colorFill = selectedHero === 'boy' ? '#4dabf7' : '#ff8787';
    let hairPath = selectedHero === 'boy' ? '<path d="M25 40 Q50 20 75 40" fill="#333"/>' : '<path d="M20 45 Q50 15 80 45" fill="#ffa94d"/>';
    
    let mouthSvg = '<path d="M42 58 Q50 66 58 58" stroke="#333" stroke-width="3" fill="none"/>'; // neutral
    let eyesSvg = '<circle cx="42" cy="45" r="3" fill="#333"/><circle cx="58" cy="45" r="3" fill="#333"/>';
    
    if (mood === 'happy') {
        mouthSvg = '<path d="M38 55 Q50 72 62 55" fill="#e64980"/>';
        eyesSvg = '<path d="M36 45 Q42 38 48 45" stroke="#333" stroke-width="3" fill="none"/><path d="M52 45 Q58 38 64 45" stroke="#333" stroke-width="3" fill="none"/>';
    } else if (mood === 'sad') {
        mouthSvg = '<path d="M42 64 Q50 54 58 64" stroke="#333" stroke-width="3" fill="none"/>';
        eyesSvg = '<circle cx="42" cy="47" r="3" fill="#333"/><circle cx="58" cy="47" r="3" fill="#333"/><path d="M36 38 L46 42" stroke="#333" stroke-width="2"/><path d="M64 38 L54 42" stroke="#333" stroke-width="2"/>';
    }

    container.innerHTML = `
        <svg viewBox="0 0 100 100" width="110" height="110" class="animate__animated animate__bounceIn">
            <circle cx="50" cy="50" r="45" fill="${colorFill}"/>
            <circle cx="50" cy="45" r="25" fill="#fff4e6"/>
            ${hairPath}
            ${eyesSvg}
            ${mouthSvg}
        </svg>
    `;
}

// Final Game Completion Scoring Tier Evaluation View
function renderFinalSummaryView() {
    navigateTo(8);
    document.getElementById('snd-complete').play().catch(()=>{});
    
    document.getElementById('final-accumulated-score').innerText = currentScorePool;
    const progressFill = document.getElementById('final-score-progress-fill');
    progressFill.style.width = `${(currentScorePool / 1000) * 100}%`;

    let rankTitle = "";
    let rankIcon = "";

    if (currentScorePool === 1000) {
        rankTitle = "You're Glorious Ruler!!";
        rankIcon = "🏆";
    } else if (currentScorePool >= 900) {
        rankTitle = "You're Immortal Conqueror!!";
        rankIcon = "🥈";
    } else if (currentScorePool >= 800) {
        rankTitle = "You're Supreme Conqueror!!";
        rankIcon = "🥉";
    } else if (currentScorePool >= 700) {
        rankTitle = "You're Conqueror!!";
        rankIcon = "🥇";
    } else if (currentScorePool >= 600) {
        rankTitle = "You're Commander!!";
        rankIcon = "🎖️";
    } else if (currentScorePool >= 500) {
        rankTitle = "You're Diamond!!";
        rankIcon = "💎";
    } else {
        rankTitle = "You're Bronze!!";
        rankIcon = "🪵";
    }

    document.getElementById('evaluation-rank-title').innerText = rankTitle;
    document.getElementById('evaluation-rank-icon').innerText = rankIcon;

    // Show final selected avatar reveal representation
    const finalBox = document.getElementById('final-avatar-reveal-box');
    let colorFill = selectedHero === 'boy' ? '#4dabf7' : '#ff8787';
    finalBox.innerHTML = `
        <svg viewBox="0 0 100 100" width="120" height="120" class="animate__animated animate__jackInTheBox">
            <circle cx="50" cy="50" r="45" fill="${colorFill}"/>
            <circle cx="50" cy="45" r="25" fill="#fff4e6"/>
            <circle cx="42" cy="45" r="3" fill="#333"/>
            <circle cx="58" cy="45" r="3" fill="#333"/>
            <path d="M38 55 Q50 72 62 55" fill="#e64980"/>
        </svg>
    `;
}

// Generate Printable Certificate Window View
function triggerCertificateWindow() {
    let studentName = prompt("โปรดกรอกชื่อ-นามสกุลจริงของนักเรียนเพื่อพิมพ์เกยรติบัตรล้ำค่า:");
    if (!studentName) return;

    const certWin = window.open('', '_blank');
    const today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    let titleAwarded = document.getElementById('evaluation-rank-title').innerText;

    certWin.document.write(`
        <html>
        <head>
            <title>เกียรติบัตรออนไลน์ - ${studentName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Prompt', sans-serif; background: #fafafa; padding: 30px; text-align: center; }
                .cert-container { border: 12px double #4f46e5; padding: 45px; background: white; max-width: 800px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                h1 { color: #4f46e5; font-size: 26pt; margin-bottom: 5px; }
                h2 { color: #64748b; font-size: 16pt; margin-top: 0; font-weight: 500; }
                .student-title { font-size: 22pt; font-weight: 700; color: #ec4899; margin: 25px 0; }
                .body-desc { font-size: 13pt; line-height: 1.8; color: #334155; }
                .badge-stamp { font-size: 14pt; font-weight: 700; color: #10b981; margin-top: 25px; }
                .print-btn { background: #4f46e5; color: white; padding: 10px 24px; font-weight:600; border:none; border-radius:8px; margin-top:30px; cursor:pointer; }
            </style>
        </head>
        <body>
            <div class="cert-container">
                <h1>เกียรติบัตรผู้ผ่านการทดสอบแบบเกม</h1>
                <h2>Flowchart & Pseudo Code Adventure Engine</h2>
                <p class="body-desc" style="margin-top:30px;">ใบประกาศเกียรติคุณฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
                <div class="student-title">${studentName}</div>
                <p class="body-desc">ได้ผ่านการประเมิน เรื่อง Flowchart & Pseudo Code ระดับชั้นมัธยมศึกษาปีที่ 4<br>
                ทำคะแนนสุทธิได้รวมทั้งสิ้น <strong>${currentScorePool} คะแนนเต็ม 1,000</strong><br>
                ได้รับยศระดับเกียรติยศสูงสุดเป็น: <strong>${titleAwarded}</strong></p>
                <div class="badge-stamp">ให้ไว้ ณ วันที่ ${today}</div>
                <button class="print-btn" onclick="window.print()">พิมพ์เกียรติบัตร / บันทึก PDF</button>
            </div>
        </body>
        </html>
    `);
    certWin.document.close();
}

// Function simulating push to Google Sheets or active logging standard console
function simulateGoogleSheetsPush(taskName, scoreGained) {
    console.log(`[Google Sheet Log] Payload dispatched: Scenario="${taskName}", ScoreGained=${scoreGained}, CumulativeScore=${currentScorePool}`);
    // ครูผู้ใช้งานสามารถเขียน fetch POST เชื่อมต่อ Google Apps Script Web App Endpoint ได้อย่างสมบูรณ์ตรงนี้
}

// Helper utility array random shuffling
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function resetAndRestartGame() {
    navigateTo(1);
    selectedHero = null;
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected-hero'));
    const startBtn = document.getElementById('start-game-btn');
    startBtn.classList.add('disabled');
    startBtn.setAttribute('disabled', 'true');
}

// Dynamic Theme Toggle setup
document.getElementById('theme-btn').addEventListener('click', () => {
    const b = document.body;
    const icon = document.getElementById('theme-btn').querySelector('i');
    if (b.classList.contains('light-mode')) {
        b.classList.remove('light-mode');
        b.classList.add('dark-mode');
        icon.className = 'fa-solid fa-sun';
    } else {
        b.classList.remove('dark-mode');
        b.classList.add('light-mode');
        icon.className = 'fa-solid fa-moon';
    }
});
