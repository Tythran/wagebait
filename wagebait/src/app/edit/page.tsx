"use client";

import { useState } from "react";
import Game from "@/components/(edit)/game";
import Question from "@/components/(edit)/question";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface GameType {
  id: string;
  title: string;
}

interface QuestionType {
  id: string;
  question: string;
  options: string[];
  correct: number[];
}

interface QuestionsByGameType {
  [gameId: string]: {
    [category: string]: QuestionType[];
  };
}

const dummyGames: GameType[] = [
  { id: "1", title: "General Trivia" },
  { id: "2", title: "Science Showdown" },
];

const dummyQuestionsByGame: QuestionsByGameType = {
  "1": {
    General: [
      {
        id: "q1",
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: [2],
      },
    ],
  },
  "2": {
    Science: [
      {
        id: "q2",
        question: "What is H2O?",
        options: ["Oxygen", "Hydrogen", "Water", "Helium"],
        correct: [2],
      },
    ],
  },
};

export default function EditPage() {
  const [games, setGames] = useState<GameType[]>(dummyGames);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [questionsByGame, setQuestionsByGame] =
    useState<QuestionsByGameType>(dummyQuestionsByGame);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");

  const currentCategories = selectedGame
    ? Object.keys(questionsByGame[selectedGame.id] || {})
    : [];

  const handleAddGame = () => {
    const newGame: GameType = { id: Date.now().toString(), title: "New Game" };
    setGames([...games, newGame]);
    setQuestionsByGame({ ...questionsByGame, [newGame.id]: {} });
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter((g) => g.id !== id));
    const updated = { ...questionsByGame };
    delete updated[id];
    setQuestionsByGame(updated);
    if (selectedGame?.id === id) setSelectedGame(null);
  };

  const handleAddCategory = () => {
    if (!selectedGame) return;
    const current = questionsByGame[selectedGame.id] || {};
    const newCategory = `Category ${Object.keys(current).length + 1}`;
    setQuestionsByGame({
      ...questionsByGame,
      [selectedGame.id]: {
        ...current,
        [newCategory]: [],
      },
    });
    setActiveCategory(newCategory);
  };

  const handleDeleteCategory = (cat: string) => {
    if (!selectedGame) return;
    const updated = { ...questionsByGame[selectedGame.id] };
    delete updated[cat];
    setQuestionsByGame({
      ...questionsByGame,
      [selectedGame.id]: updated,
    });
    if (activeCategory === cat) setActiveCategory("");
  };

  const handleRenameCategory = () => {
    if (!selectedGame || !editingCategory || !editedCategoryName) return;
    const current = questionsByGame[selectedGame.id];
    const updated: { [key: string]: QuestionType[] } = {};
    for (const key in current) {
      updated[key === editingCategory ? editedCategoryName : key] =
        current[key];
    }
    setQuestionsByGame({
      ...questionsByGame,
      [selectedGame.id]: updated,
    });
    setActiveCategory(editedCategoryName);
    setEditingCategory(null);
    setEditedCategoryName("");
  };

  const handleAddQuestion = () => {
    if (!selectedGame || !activeCategory) return;
    const newQuestion: QuestionType = {
      id: Date.now().toString(),
      question: "New Question",
      options: ["", "", "", ""],
      correct: [],
    };
    setQuestionsByGame({
      ...questionsByGame,
      [selectedGame.id]: {
        ...questionsByGame[selectedGame.id],
        [activeCategory]: [
          ...(questionsByGame[selectedGame.id][activeCategory] || []),
          newQuestion,
        ],
      },
    });
  };

  const handleRenameGame = (id: string, newTitle: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, title: newTitle } : g))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedGame) return;

    const items = questionsByGame[selectedGame.id][activeCategory];
    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setQuestionsByGame({
      ...questionsByGame,
      [selectedGame.id]: {
        ...questionsByGame[selectedGame.id],
        [activeCategory]: reordered,
      },
    });
  };

  return (
    <div className="d-flex vh-100 bg-dark text-light animate__animated animate__fadeIn">
      {/* Game List */}
      <div
        className="border-end border-secondary p-3"
        style={{ width: "300px" }}
      >
        <h4 className="d-flex justify-content-between align-items-center">
          Games{" "}
          <i className="bi bi-plus" role="button" onClick={handleAddGame}></i>
        </h4>
        <div className="list-group mt-3">
          {games.map((game) => (
            <Game
              key={game.id}
              game={game}
              isActive={selectedGame?.id === game.id}
              onEdit={() => {
                setSelectedGame(game);
                const gameCategories = Object.keys(
                  questionsByGame[game.id] || {}
                );
                setActiveCategory(gameCategories[0] || "");
              }}
              onDelete={() => handleDeleteGame(game.id)}
              onRename={(newTitle) => handleRenameGame(game.id, newTitle)}
            />
          ))}
        </div>
      </div>

      {/* Game Editor */}
      <div className="flex-grow-1 p-4 animate__animated animate__fadeIn">
        {selectedGame ? (
          <>
            <h3 className="mb-4">Edit: {selectedGame.title}</h3>

            {/* Category Tabs */}
            <div className="d-flex align-items-center mb-3 overflow-auto">
              <ul className="nav nav-tabs flex-nowrap border-0">
                {currentCategories.map((cat) => (
                  <li
                    className="nav-item d-flex align-items-center me-2 cursor-pointer"
                    key={cat}
                  >
                    {editingCategory === cat ? (
                      <input
                        className="form-control form-control-sm me-1 bg-dark text-white border-end-0 border-start-0"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        onBlur={handleRenameCategory}
                        autoFocus
                      />
                    ) : (
                      <a
                        className={`nav-link d-flex align-items-center fw-semibold ${
                          activeCategory === cat
                            ? "text-white bg-primary bg-opacity-25 border border-primary"
                            : "text-light border border-secondary"
                        }`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                        <i
                          className="bi bi-pencil ms-2"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingCategory(cat);
                            setEditedCategoryName(cat);
                          }}
                        ></i>
                        <i
                          className="bi bi-trash ms-2"
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat);
                          }}
                        ></i>
                      </a>
                    )}
                  </li>
                ))}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={handleAddCategory}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </li>
              </ul>
            </div>

            {/* Questions List with Drag Context */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questionsByGame[selectedGame.id]?.[activeCategory] || []}
                strategy={verticalListSortingStrategy}
              >
                {(questionsByGame[selectedGame.id]?.[activeCategory] || []).map(
                  (q) => (
                    <Question
                      key={q.id}
                      questionData={q}
                      onChange={(updated) => {
                        const updatedQuestions = questionsByGame[
                          selectedGame.id
                        ][activeCategory].map((item) =>
                          item.id === updated.id ? updated : item
                        );
                        setQuestionsByGame({
                          ...questionsByGame,
                          [selectedGame.id]: {
                            ...questionsByGame[selectedGame.id],
                            [activeCategory]: updatedQuestions,
                          },
                        });
                      }}
                      onDelete={() => {
                        const filtered = questionsByGame[selectedGame.id][
                          activeCategory
                        ].filter((item) => item.id !== q.id);
                        setQuestionsByGame({
                          ...questionsByGame,
                          [selectedGame.id]: {
                            ...questionsByGame[selectedGame.id],
                            [activeCategory]: filtered,
                          },
                        });
                      }}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>

            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-success" onClick={handleAddQuestion}>
                <i className="bi bi-plus me-1"></i> Add Question
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </>
        ) : (
          <p className="text-secondary">Select a game to edit.</p>
        )}
      </div>
    </div>
  );
}
