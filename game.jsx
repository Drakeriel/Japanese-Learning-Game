import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Phaser from "phaser";
import useSound from "use-sound";
import clickSfx from "@/sounds/click.mp3";
import successSfx from "@/sounds/success.mp3";
import failSfx from "@/sounds/fail.mp3";
import eerieSfx from "@/sounds/eerie.mp3";
import { motion } from "framer-motion";

const story = `You wake up in a dimly lit cabin, your head pounding. You have no memory of how you got here. 
Strange symbols cover the walls—Japanese characters you don't recognize. The only way forward is to learn what they mean.
With each word you uncover, pieces of your past start to emerge. Who are you? Why are you here? And what lies beyond the locked door?`;

const rooms = {
  cabin: {
    background: "cabin-optimized",
    description: "A cozy but mysterious wooden cabin.",
  },
  hallway: {
    background: "hallway-optimized",
    description: "A dimly lit hallway leading to more rooms.",
  },
  library: {
    background: "library-optimized",
    description: "Shelves lined with books, some of which may hold secrets.",
  },
  kitchen: {
    background: "kitchen-optimized",
    description: "An old kitchen with utensils and ingredients scattered about.",
  }
};

const items = [
  { japanese: "鍵", romaji: "kagi", english: "key", use: "Unlocks doors", sprite: "key-optimized" },
  { japanese: "本", romaji: "hon", english: "book", use: "Contains useful information", sprite: "book-optimized" },
  { japanese: "火", romaji: "hi", english: "fire", use: "Can ignite objects", sprite: "fire-optimized" },
  { japanese: "木", romaji: "ki", english: "wood", use: "Can be burned for light", sprite: "wood-optimized" },
  { japanese: "鍋", romaji: "nabe", english: "pot", use: "Used for cooking", sprite: "pot-optimized" },
  ...Array.from({ length: 200 }, (_, i) => ({
    japanese: `アイテム${i + 1}`,
    romaji: `aitemu${i + 1}`,
    english: `Item ${i + 1}`,
    use: "For learning purposes",
    sprite: "generic-optimized"
  }))
];

export default function PointAndClickGame() {
  const [currentRoom, setCurrentRoom] = useState("cabin");
  const [inventory, setInventory] = useState([]);
  const [gameMessage, setGameMessage] = useState("");
  const [playClick] = useSound(clickSfx);
  const [playSuccess] = useSound(successSfx);
  const [playFail] = useSound(failSfx);
  const [playEerie] = useSound(eerieSfx);

  useEffect(() => {
    let game;
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: {
        preload: function () {
          Object.values(rooms).forEach(room => this.load.image(room.background, `/assets/backgrounds/${room.background}.webp`));
          items.forEach(item => this.load.image(item.sprite, `/assets/items/${item.sprite}.webp`));
        },
        create: function () {
          this.add.image(400, 300, rooms[currentRoom].background).setScale(1.1);
        },
      },
    };
    if (!Phaser.GAMES.length) {
      game = new Phaser.Game(config);
    }
    return () => {
      if (game) game.destroy(true);
    };
  }, [currentRoom]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Mysterious Cabin</h1>
      <p className="italic text-gray-600 text-center max-w-lg">{story}</p>
      <p>Current Room: {rooms[currentRoom].description}</p>
      <div id="game-container" className="w-[800px] h-[600px] border border-gray-500"></div>
      <div className="mt-4 p-4 border rounded-lg w-80 text-center">
        <h2 className="text-lg font-bold">Inventory</h2>
        <ul>
          {inventory.map((item, index) => (
            <li key={index} className="text-lg">{item.english} ({item.japanese})</li>
          ))}
        </ul>
      </div>
      {gameMessage && (
        <motion.p
          className="mt-4 text-lg font-semibold text-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameMessage}
        </motion.p>
      )}
    </div>
  );
}
