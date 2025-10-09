<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Çarpım Tablosu Oyunu</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }
        body {
            overscroll-behavior: none;
            touch-action: manipulation;
        }
        .confetti {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script type="module">
        const { useState, useEffect, useRef, createElement: h } = React;

        function CarpimTablosuOyunu() {
            const [currentQuestion, setCurrentQuestion] = useState(null);
            const [score, setScore] = useState(0);
            const [totalQuestions, setTotalQuestions] = useState(0);
            const [feedback, setFeedback] = useState(null);
            const [droppedDigits, setDroppedDigits] = useState([]);
            const [selectedNumber, setSelectedNumber] = useState(null);
            const [confetti, setConfetti] = useState([]);

            const generateQuestion = () => {
                const num1 = Math.floor(Math.random() * 10) + 1;
                const num2 = Math.floor(Math.random() * 10) + 1;
                const result = num1 * num2;
                const questionType = Math.random() > 0.5 ? 'result' : 'factor';
                
                if (questionType === 'result') {
                    setCurrentQuestion({
                        type: 'result',
                        num1,
                        num2,
                        answer: result,
                        display: `${num1} × ${num2} = ?`
                    });
                } else {
                    const missingNum = Math.random() > 0.5 ? num1 : num2;
                    const knownNum = missingNum === num1 ? num2 : num1;
                    setCurrentQuestion({
                        type: 'factor',
                        missingNum,
                        knownNum,
                        result,
                        answer: missingNum,
                        display: missingNum === num1 ? `? × ${knownNum} = ${result}` : `${knownNum} × ? = ${result}`
                    });
                }
                setDroppedDigits([]);
                setFeedback(null);
                setSelectedNumber(null);
            };

            useEffect(() => {
                generateQuestion();
            }, []);

            const handleNumberClick = (number) => {
                setSelectedNumber(number);
                
                const maxDigits = currentQuestion.answer.toString().length;
                const filledCount = droppedDigits.filter(d => d !== null && d !== undefined).length;
                
                if (filledCount < maxDigits) {
                    const newDropped = [...droppedDigits];
                    newDropped[filledCount] = number;
                    setDroppedDigits(newDropped);
                }
                
                setTimeout(() => {
                    setSelectedNumber(null);
                }, 200);
            };

            const handleClear = () => {
                setDroppedDigits([]);
                setSelectedNumber(null);
            };

            const createConfetti = () => {
                const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
                const newConfetti = [];
                
                for (let i = 0; i < 80; i++) {
                    newConfetti.push({
                        id: Math.random(),
                        x: Math.random() * window.innerWidth,
                        y: -20,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * 8 + 4,
                        speedY: Math.random() * 3 + 2,
                        speedX: (Math.random() - 0.5) * 4,
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 10
                    });
                }
                
                setConfetti(newConfetti);
            };

            useEffect(() => {
                if (confetti.length === 0) return;
                
                const interval = setInterval(() => {
                    setConfetti(prev => {
                        const updated = prev.map(c => ({
                            ...c,
                            y: c.y + c.speedY,
                            x: c.x + c.speedX,
                            rotation: c.rotation + c.rotationSpeed
                        })).filter(c => c.y < window.innerHeight);
                        
                        if (updated.length === 0) return [];
                        return updated;
                    });
                }, 30);
                
                return () => clearInterval(interval);
            }, [confetti]);

            const checkAnswer = () => {
                const userAnswer = droppedDigits.filter(d => d !== null && d !== undefined).join('');
                const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
                
                setTotalQuestions(totalQuestions + 1);
                if (isCorrect) {
                    setScore(score + 1);
                    setFeedback('correct');
                    createConfetti();
                } else {
                    setFeedback('wrong');
                }
                
                setTimeout(() => {
                    generateQuestion();
                }, 1500);
            };

            const maxDigits = currentQuestion ? currentQuestion.answer.toString().length : 2;

            return h('div', { 
                className: 'min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400',
                style: { minHeight: '100vh', paddingBottom: '20px', position: 'relative', overflow: 'hidden' }
            },
                confetti.map(c => h('div', {
                    key: c.id,
                    style: {
                        position: 'fixed',
                        left: c.x + 'px',
                        top: c.y + 'px',
                        width: c.size + 'px',
                        height: c.size + 'px',
                        backgroundColor: c.color,
                        borderRadius: '50%',
                        transform: `rotate(${c.rotation}deg)`,
                        pointerEvents: 'none',
                        zIndex: 9999
                    }
                })),
                h('div', { className: 'max-w-full px-3 py-4' },
                    h('div', { className: 'bg-white rounded-2xl shadow-2xl p-4 mb-4' },
                        h('div', { className: 'flex justify-between items-center mb-4' },
                            h('h1', { className: 'text-2xl font-bold text-purple-600' }, 'Çarpım Tablosu'),
                            h('div', { className: 'text-right' },
                                h('div', { className: 'text-xl font-bold text-green-600' }, `${score} / ${totalQuestions}`),
                                h('div', { className: 'text-xs text-gray-600' }, 'Doğru')
                            )
                        ),
                        h('div', { className: 'mb-4' },
                            h('div', { className: 'text-center mb-2 text-sm font-semibold text-gray-700' }, 'Sayılara Dokunun'),
                            h('div', { className: 'grid grid-cols-5 gap-2 bg-blue-50 p-3 rounded-xl' },
                                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => 
                                    h('button', {
                                        key: num,
                                        onClick: () => handleNumberClick(num),
                                        className: `w-full aspect-square border-3 rounded-lg flex items-center justify-center text-2xl font-bold transition-all shadow-md ${
                                            selectedNumber === num
                                                ? 'bg-blue-500 border-blue-700 text-white scale-95'
                                                : 'bg-white border-blue-400 text-blue-600 active:bg-blue-200'
                                        }`,
                                        style: { touchAction: 'manipulation' }
                                    }, num)
                                )
                            )
                        ),
                        currentQuestion && h('div', { className: 'bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4' },
                            h('div', { 
                                className: 'text-3xl font-bold text-center text-gray-800 mb-4',
                                style: { fontSize: '2rem' }
                            }, currentQuestion.display),
                            h('div', { className: 'flex justify-center items-center gap-2 mb-4' },
                                [...Array(maxDigits)].map((_, index) => 
                                    h('div', {
                                        key: index,
                                        className: `w-16 h-16 border-3 ${
                                            droppedDigits[index] !== null && droppedDigits[index] !== undefined
                                                ? 'border-green-400 bg-green-50'
                                                : 'border-dashed border-gray-400 bg-white'
                                        } rounded-lg flex items-center justify-center text-3xl font-bold transition-all`
                                    }, droppedDigits[index] !== null && droppedDigits[index] !== undefined ? droppedDigits[index] : '')
                                )
                            ),
                            h('div', { className: 'flex gap-2 mb-4' },
                                h('button', {
                                    onClick: handleClear,
                                    className: 'flex-1 bg-red-500 text-white px-4 py-3 rounded-xl text-base font-bold active:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2'
                                }, '🗑️ Temizle'),
                                h('button', {
                                    onClick: checkAnswer,
                                    disabled: droppedDigits.filter(d => d !== null && d !== undefined).length === 0,
                                    className: 'flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl text-base font-bold active:from-green-600 active:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg'
                                }, 'Kontrol Et')
                            ),
                            feedback && h('div', { 
                                className: `mt-2 p-3 rounded-xl flex items-center justify-center gap-2 ${
                                    feedback === 'correct' ? 'bg-green-200' : 'bg-red-200'
                                }`
                            },
                                feedback === 'correct' ? [
                                    h('span', { key: 'icon' }, '✓'),
                                    h('span', { key: 'text', className: 'text-lg font-bold text-green-700' }, 'Doğru! Aferin!')
                                ] : [
                                    h('span', { key: 'icon' }, '✗'),
                                    h('span', { key: 'text', className: 'text-lg font-bold text-red-700' }, `Yanlış! Cevap: ${currentQuestion.answer}`)
                                ]
                            )
                        ),
                        h('div', { className: 'text-center' },
                            h('button', {
                                onClick: generateQuestion,
                                className: 'bg-purple-500 text-white px-5 py-3 rounded-xl font-bold active:bg-purple-600 transition-all flex items-center gap-2 mx-auto shadow-lg w-full justify-center'
                            }, '🔄 Yeni Soru')
                        )
                    )
                )
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('app'));
        root.render(React.createElement(CarpimTablosuOyunu));
    </script>

    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</body>
</html>