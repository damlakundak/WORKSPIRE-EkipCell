import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { motion } from 'framer-motion';
import Sidebar from "./Sidebar";
import { FaBars, FaSearch, FaEnvelope, FaBell, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";

const cardImages = [
  { src: '🍎', id: 1 },
  { src: '🍌', id: 2 },
  { src: '🍇', id: 3 },
  { src: '🍉', id: 4 },
  { src: '🍒', id: 5 },
  { src: '🍍', id: 6 }
];

const MemoryGame = () => {
  const { darkMode, language } = useOutletContext();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (matchedCards.length === cardImages.length) {
      setGameWon(true);
    }
  }, [matchedCards]);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setTurns(0);
    setGameWon(false);
  };

  const handleFlip = (card) => {
    if (flippedCards.length === 1) {
      setFlippedCards([flippedCards[0], card]);
      setTurns(turns + 1);

      if (flippedCards[0].src === card.src) {
        setMatchedCards([...matchedCards, flippedCards[0].src]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    } else {
      setFlippedCards([card]);
    }
  };

  const translations = {
    tr: {
      gameName: "Hafıza Oyunu",
      start: "Yeniden Başlat",
      turn:"Hamle Sayısı:",
      win: "Kazandınız!"
      
    },
    en: {
      gameName: "Memory Game",
      start: "Restart Game",
      turn:"Turns:",
      win: "You Win!" 
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} h-screen p-6 relative flex`}>
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-3xl font-bold mb-8">{language === "tr" ? "Hafıza Oyunu" : "Memory Game"}</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6" onClick={shuffleCards}>
            {language === "tr" ? "Yeniden Başlat" : "Restart Game"}
          </button>
          <div className="grid grid-cols-4 gap-4">
            {cards.map(card => (
              <motion.div
                key={card.id}
                onClick={() => handleFlip(card)}
                className="w-24 h-32 flex items-center justify-center bg-yellow-300 border border-gray-500 rounded-lg cursor-pointer shadow-lg"
                animate={{ rotateY: flippedCards.includes(card) || matchedCards.includes(card.src) ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {(flippedCards.includes(card) || matchedCards.includes(card.src)) ? <span className="text-3xl">{card.src}</span> : null}
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xl">{language === "tr" ? "Hamle Sayısı:" : "Turns:"} {turns}</p>

          {gameWon && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-xl text-center">
                <h2 className="text-3xl font-bold mb-4">{language === "tr" ? "Kazandınız!" : "You Win!"}</h2>
                <button
                  onClick={shuffleCards}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {language === "tr" ? "Yeniden Başlat" : "Restart"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default MemoryGame;
