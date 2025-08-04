// Zegju Flashcard Mini App (React + Tailwind + Framer Motion + Sound Effects)
// Upgraded for category selection, progress bar, fun UAT-themed feedback, timer, and high-end award-level design

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, RefreshCw, TimerReset } from 'lucide-react';

const correctSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_5eb3c235c4.mp3?filename=correct-answer-2-96176.mp3';
const wrongSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_57c999a5b1.mp3?filename=wrong-answer-3-96175.mp3';

const categories = {
  verbal: [
    {
      question: 'Which word is closest in meaning to "abundant"?',
      options: ['Rare', 'Scattered', 'Plentiful', 'Little'],
      answer: 'Plentiful',
      explanation: '"Abundant" means "a lot" or "plentiful".',
    },
  ],
  quantitative: [
    {
      question: 'If 3x = 12, what is x?',
      options: ['4', '3', '6', '12'],
      answer: '4',
      explanation: 'Divide both sides by 3: x = 12 / 3 = 4.',
    },
  ],
  analytical: [
    {
      question: 'If all roses are flowers, and some flowers fade quickly, can we say some roses fade quickly?',
      options: ['Yes', 'No', 'Maybe', 'Not enough info'],
      answer: 'Not enough info',
      explanation: 'We can’t be sure if those flowers include roses.',
    },
  ],
};

const feedbackPhrases = {
  correct: [
    "🔥 Brilliant! You're Addis Ababa University material!",
    '🌟 Perfect! The UAT exam has nothing on you!',
    '💡 Genius move! You’re streaking to success!',
  ],
  wrong: [
    "😅 Oops! Don’t let the UAT win this round.",
    '💥 Missed it! But Addis doesn’t give up.',
    '🌀 Not quite. Let’s crush the next one.',
  ],
};

export default function FlashcardApp() {
  const [category, setCategory] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timer, setTimer] = useState(15);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (timer > 0 && selected === null && category) {
      const id = setInterval(() => setTimer((t) => t - 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (timer === 0 && selected === null) {
      handleAnswer('');
    }
  }, [timer, selected, category]);

  const startCategory = (cat) => {
    setCategory(cat);
    setFlashcards(categories[cat]);
    setCurrent(0);
    setTimer(15);
    setSelected(null);
    setIsCorrect(null);
    setStreak(0);
  };

  const handleAnswer = (option) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === flashcards[current].answer;
    setIsCorrect(correct);
    const audio = new Audio(correct ? correctSoundUrl : wrongSoundUrl);
    audio.play();
    if (intervalId) clearInterval(intervalId);
    if (correct) {
      setStreak(streak + 1);
      confetti({ particleCount: 70, spread: 70 });
    } else {
      setStreak(0);
    }
  };

  const nextCard = () => {
    setSelected(null);
    setIsCorrect(null);
    setTimer(15);
    setCurrent((prev) => (prev + 1) % flashcards.length);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <h1 className="text-2xl font-bold text-center text-purple-800">Choose a UAT Section</h1>
          <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg rounded-xl py-3" onClick={() => startCategory('verbal')}>Verbal Reasoning</Button>
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg rounded-xl py-3" onClick={() => startCategory('quantitative')}>Quantitative Reasoning</Button>
          <Button className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white text-lg rounded-xl py-3" onClick={() => startCategory('analytical')}>Analytical Reasoning</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <motion.div
          className="rounded-2xl shadow-xl bg-white p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-purple-800">
              🔥 Streak: {streak}
            </div>
            <div className="flex items-center gap-2">
              <TimerReset className="w-5 h-5 text-purple-800" />
              <span className="text-md font-medium text-gray-600">{timer}s</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / flashcards.length) * 100}%` }}
            ></div>
          </div>

          <div className="text-lg font-bold text-gray-800">
            {flashcards[current].question}
          </div>

          <div className="grid gap-2">
            {flashcards[current].options.map((option, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(option)}
                className={`w-full py-3 rounded-xl text-lg border shadow-md font-semibold transition-all duration-200
                  ${selected && option === flashcards[current].answer ? 'bg-green-100 border-green-500 text-green-900' : ''}
                  ${selected && option === selected && option !== flashcards[current].answer ? 'bg-red-100 border-red-500 text-red-900' : ''}`}
                disabled={selected}
              >
                {option}
              </Button>
            ))}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-gray-700"
            >
              {isCorrect ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" /> {feedbackPhrases.correct[Math.floor(Math.random() * feedbackPhrases.correct.length)]} {flashcards[current].explanation}
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="w-5 h-5 mr-1" /> {feedbackPhrases.wrong[Math.floor(Math.random() * feedbackPhrases.wrong.length)]} {flashcards[current].explanation}
                </div>
              )}
              <div className="mt-4">
                <Button onClick={nextCard} className="bg-purple-700 hover:bg-purple-800 text-white w-full py-3 text-lg rounded-xl shadow-lg">
                  <RefreshCw className="w-4 h-4 mr-2" /> Next Card
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
