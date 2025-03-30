"use client";

import { useState, useEffect } from "react";
import Game from "@/components/(edit)/game";
import Question from "@/components/(edit)/question";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createClient } from "@/utils/supabase/client";
import { randomString } from "@/components/utils";
const supabase = createClient();

interface Game {
  game_id: string;
  game_title: string;
  created_by: string;
}
interface Category {
  category_id: string;
  game_id: string;
  category_name: string;
}
export interface QuestionData {
  question_id: string;
  category_id: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_1: boolean;
  correct_2: boolean;
  correct_3: boolean;
  correct_4: boolean;
}

export default function EditPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categoriesByGame, setCategoriesByGame] = useState<{
    [key: string]: Category[];
  }>({});
  const [questionsByCategory, setQuestionsByCategory] = useState<{
    [key: string]: QuestionData[];
  }>({});
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }

        const currentUserId = userData?.user?.id || null;
        setUserId(currentUserId);

        if (!currentUserId) {
          console.warn("User ID not found. Skipping games fetch.");
          return;
        }

        const { data: gamesData, error: gamesError } = await supabase
          .from("games")
          .select("*")
          .eq("created_by", currentUserId);

        if (gamesError) {
          console.error("Error fetching games:", gamesError);
          return;
        }

        setGames(gamesData || []);
        console.log("Games fetched successfully!", gamesData);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("category")
          .select("*");
        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          return;
        }

        const catByGame: { [key: string]: Category[] } = {};
        (categoriesData || []).forEach((cat: Category) => {
          if (!catByGame[cat.game_id]) {
            catByGame[cat.game_id] = [];
          }
          catByGame[cat.game_id].push(cat);
        });
        setCategoriesByGame(catByGame);

        const { data: questionsData, error: questionsError } = await supabase
          .from("question")
          .select("*");
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          return;
        }

        const questByCat: { [key: string]: QuestionData[] } = {};
        (questionsData || []).forEach((q: QuestionData) => {
          const catId = q.category_id;
          if (!questByCat[catId]) {
            questByCat[catId] = [];
          }
          questByCat[catId].push({
            question_id: q.question_id,
            category_id: q.category_id,
            question_text: q.question_text ?? "",
            option_1: q.option_1 ?? "",
            option_2: q.option_2 ?? "",
            option_3: q.option_3 ?? "",
            option_4: q.option_4 ?? "",
            correct_1: q.correct_1,
            correct_2: q.correct_2,
            correct_3: q.correct_3,
            correct_4: q.correct_4,
          });
        });
        setQuestionsByCategory(questByCat);
        console.log("Questions fetched successfully!");
      } catch (exception) {
        console.error("Unexpected error fetching data:", exception);
      }
    };

    fetchUserAndData();
  }, []);

  const handleAddGame = async () => {
    const defaultTitle = "new game";
    try {
      if (!userId) {
        console.error("User not authenticated.");
        return;
      }

      const { error } = await supabase.from("games").insert({
        game_title: defaultTitle,
        created_by: userId,
      });
      if (error) {
        console.error("Error adding game:", error);
        return;
      }
      console.log("Game added successfully!");

      const { data: updatedGames, error: fetchError } = await supabase
        .from("games")
        .select("*")
        .eq("created_by", userId);
      if (fetchError) {
        console.error("Error fetching updated games:", fetchError);
        return;
      }
      setGames(updatedGames || []);
    } catch (exception) {
      console.error("Unexpected error adding game:", exception);
    }
  };

  const handleRenameGame = async (gameId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("games")
        .update({ game_title: newTitle })
        .eq("game_id", gameId);

      if (error) {
        console.error("Error renaming game:", error);
        return;
      }

      const { data: updatedGames, error: fetchError } = await supabase
        .from("games")
        .select("*")
        .eq("created_by", userId);

      if (fetchError) {
        console.error("Error fetching updated games:", fetchError);
        return;
      }

      setGames(updatedGames || []);

      if (selectedGame && selectedGame.game_id === gameId) {
        const updatedGame = updatedGames.find(
          (game: Game) => game.game_id === gameId
        );
        setSelectedGame(updatedGame);
      }
    } catch (exception) {
      console.error("Unexpected error renaming game:", exception);
    }
  };
  const handleDeleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("game_id", gameId);
      if (error) {
        console.error("Error deleting game:", error);
        return;
      }
      console.log("Game deleted successfully!");

      const { data: updatedGames, error: fetchError } = await supabase
        .from("games")
        .select("*")
        .eq("created_by", userId);

      if (fetchError) {
        console.error("Error fetching updated games:", fetchError);
        return;
      }
      setGames(updatedGames || []);

      if (selectedGame && selectedGame.game_id === gameId) {
        setSelectedGame(null);
        setActiveCategory("");
      }

      const updatedCategories = { ...categoriesByGame };
      delete updatedCategories[gameId];
      setCategoriesByGame(updatedCategories);
    } catch (exception) {
      console.error("Unexpected error deleting game:", exception);
    }
  };

  const handleAddCategory = async (categoryName: string) => {
    if (!categoryName || typeof categoryName !== "string") {
      console.error("Invalid category name");
      return;
    }

    try {
      const { error } = await supabase.from("category").insert({
        category_name: categoryName,
        game_id: selectedGame?.game_id,
      });

      if (error) {
        console.error("Error adding category:", error);
        return;
      }

      console.log("Category added successfully!");

      if (selectedGame) {
        const { data: updatedCategories, error: fetchError } = await supabase
          .from("category")
          .select("*")
          .eq("game_id", selectedGame.game_id);

        if (fetchError) {
          console.error("Error fetching updated categories:", fetchError);
          return;
        }

        setCategoriesByGame((prev) => ({
          ...prev,
          [selectedGame.game_id]: updatedCategories,
        }));
      }
    } catch (exception) {
      console.error("Unexpected error adding category:", exception);
    }
  };

  const handleRenameCategory = async () => {
    if (!selectedGame || !editingCategory || !editedCategoryName) {
      console.error("Invalid category rename operation!");
      return;
    }
    try {
      const { error } = await supabase
        .from("category")
        .update({ category_name: editedCategoryName })
        .eq("category_id", editingCategory);

      if (error) {
        console.error("Error renaming category:", error);
        return;
      }

      const updatedCategories = (
        categoriesByGame[selectedGame.game_id] || []
      ).map((cat) =>
        cat.category_id === editingCategory
          ? { ...cat, category_name: editedCategoryName }
          : cat
      );
      setCategoriesByGame({
        ...categoriesByGame,
        [selectedGame.game_id]: updatedCategories,
      });
      setEditingCategory(null);
      setEditedCategoryName("");
      console.log("Category renamed successfully!");
    } catch (exception) {
      console.error("Unexpected error renaming category:", exception);
    }
  };
  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedGame || !categoryId) {
      console.error("Invalid category delete operation!");
      return;
    }
    try {
      const { error } = await supabase
        .from("category")
        .delete()
        .eq("category_id", categoryId);

      if (error) {
        console.error("Error deleting category:", error);
        return;
      }

      const updatedCategories = (
        categoriesByGame[selectedGame.game_id] || []
      ).filter((cat) => cat.category_id !== categoryId);
      setCategoriesByGame({
        ...categoriesByGame,
        [selectedGame.game_id]: updatedCategories,
      });
      console.log("Category deleted successfully!");
    } catch (exception) {
      console.error("Unexpected error deleting category:", exception);
    }
  };

  const handleAddQuestion = () => {
    if (!activeCategory) {
      console.error("No active category selected.");
      return;
    }

    const tempId = `new-${Date.now()}`;
    const newQuestion: QuestionData = {
      question_id: tempId,
      category_id: activeCategory,
      question_text: "New Question",
      option_1: "",
      option_2: "",
      option_3: "",
      option_4: "",
      correct_1: false,
      correct_2: false,
      correct_3: false,
      correct_4: false,
    };

    setQuestionsByCategory((prev) => {
      const updated = [newQuestion, ...(prev[activeCategory] || [])];
      return { ...prev, [activeCategory]: updated };
    });
  };

  const handleUpdateQuestion = async (updatedQuestion: QuestionData) => {
    if (!selectedGame || !activeCategory) {
      console.error("Error: No game or category selected!");
      return;
    }

    if (updatedQuestion.question_id.startsWith("new-")) {
      const { data, error } = await supabase
        .from("question")
        .insert({
          category_id: updatedQuestion.category_id,
          question_text: updatedQuestion.question_text,
          option_1: updatedQuestion.option_1,
          option_2: updatedQuestion.option_2,
          option_3: updatedQuestion.option_3,
          option_4: updatedQuestion.option_4,
          correct_1: updatedQuestion.correct_1,
          correct_2: updatedQuestion.correct_2,
          correct_3: updatedQuestion.correct_3,
          correct_4: updatedQuestion.correct_4,
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Error saving new question:", error);
        return;
      }

      setQuestionsByCategory((prev) => {
        const updated = prev[activeCategory].map((q) =>
          q.question_id === updatedQuestion.question_id
            ? { ...updatedQuestion, question_id: data.question_id }
            : q
        );
        return { ...prev, [activeCategory]: updated };
      });
    } else {
      const { error } = await supabase
        .from("question")
        .update({
          question_text: updatedQuestion.question_text,
          option_1: updatedQuestion.option_1,
          option_2: updatedQuestion.option_2,
          option_3: updatedQuestion.option_3,
          option_4: updatedQuestion.option_4,
          correct_1: updatedQuestion.correct_1,
          correct_2: updatedQuestion.correct_2,
          correct_3: updatedQuestion.correct_3,
          correct_4: updatedQuestion.correct_4,
        })
        .eq("question_id", updatedQuestion.question_id);

      if (error) {
        console.error("Error updating question:", error);
        return;
      }

      setQuestionsByCategory((prev) => {
        const updatedQuestions = prev[activeCategory].map((quest) =>
          quest.question_id === updatedQuestion.question_id
            ? updatedQuestion
            : quest
        );
        return { ...prev, [activeCategory]: updatedQuestions };
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedGame || !activeCategory) {
      console.error("Error: No game or category selected!");
      return;
    }

    const { error } = await supabase
      .from("question")
      .delete()
      .eq("question_id", questionId);

    if (error) {
      console.error("Error deleting question:", error);
      return;
    }

    setQuestionsByCategory((prev) => {
      const updatedQuestions = prev[activeCategory].filter(
        (quest) => quest.question_id !== questionId
      );
      return { ...prev, [activeCategory]: updatedQuestions };
    });
  };

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeCategory) return;
    setQuestionsByCategory((prev) => {
      const items = prev[activeCategory] || [];
      const oldIndex = items.findIndex((q) => q.question_id === active.id);
      const newIndex = items.findIndex((q) => q.question_id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      return {
        ...prev,
        [activeCategory]: reordered,
      };
    });
  };

  const currentCategoryQuestions = questionsByCategory[activeCategory] || [];

  const handleActiveGame = async () => {
    const sessionCode = randomString();
    const { error } = await supabase.from("active_games").insert({
      session_code: sessionCode,
      game_id: selectedGame?.game_id,
      start_time: new Date().toISOString(),
      round_number: 1,
    });

    if (error) {
      console.error("Error activating game:", error);
    } else {
      console.log("Game activated successfully!");
    }
  };

  const handleCategoryDragEnd = (
    event: import("@dnd-kit/core").DragEndEvent
  ) => {
    const { active, over } = event;

    if (!selectedGame || !over || active.id === over.id) return;

    const currentCategories = categoriesByGame[selectedGame.game_id] || [];
    const oldIndex = currentCategories.findIndex(
      (c) => c.category_id === active.id
    );
    const newIndex = currentCategories.findIndex(
      (c) => c.category_id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(currentCategories, oldIndex, newIndex);

    setCategoriesByGame((prev) => ({
      ...prev,
      [selectedGame.game_id]: reordered,
    }));
  };

  return (
    <div className="d-flex vh-100 bg-dark text-light animate__animated animate__fadeIn">
      {/* Sidebar for Games */}
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
            <div
              key={game.game_id}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <Game
                game={game}
                isActive={selectedGame?.game_id === game.game_id}
                onEdit={() => {
                  setSelectedGame(game);
                  const gameCategories = categoriesByGame[game.game_id] || [];
                  setActiveCategory(gameCategories[0]?.category_id || "");
                }}
                onDelete={() => handleDeleteGame(game.game_id)}
                onRename={(newTitle) =>
                  handleRenameGame(game.game_id, newTitle)
                }
              />
              {selectedGame?.game_id === game.game_id && (
                <i
                  className="bi bi-play-circle-fill text-success ms-2 fs-5"
                  role="button"
                  title="Activate Game"
                  onClick={handleActiveGame}
                ></i>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow-1 p-4">
        {selectedGame ? (
          <>
            <h3>{selectedGame.game_title}</h3>

            <div className="mb-4">
              <h5>Categories</h5>
              <DndContext onDragEnd={handleCategoryDragEnd}>
                <SortableContext
                  items={(categoriesByGame[selectedGame.game_id] || []).map(
                    (cat) => cat.category_id
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {(categoriesByGame[selectedGame.game_id] || []).map(
                      (cat) => (
                        <div
                          key={cat.category_id}
                          className={`btn d-flex align-items-center ${
                            activeCategory === cat.category_id
                              ? "btn-primary"
                              : "btn-outline-light"
                          }`}
                          onClick={() => setActiveCategory(cat.category_id)}
                          style={{ cursor: "pointer" }}
                        >
                          {editingCategory === cat.category_id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm bg-dark text-light border-0"
                              value={editedCategoryName}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setEditedCategoryName(e.target.value)
                              }
                              onBlur={handleRenameCategory}
                              autoFocus
                            />
                          ) : (
                            <span
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(cat.category_id);
                                setEditedCategoryName(cat.category_name);
                              }}
                            >
                              {cat.category_name}
                            </span>
                          )}
                          <i
                            className="bi bi-trash ms-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(cat.category_id);
                            }}
                          ></i>
                        </div>
                      )
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddCategory("New Category Name")}
                    >
                      Add Category
                    </button>
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <div className="mb-4">
              <h5>Questions</h5>
              {activeCategory ? (
                <>
                  <button
                    className="btn btn-outline-success mb-2"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </button>
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={currentCategoryQuestions.map((q) => q.question_id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {currentCategoryQuestions.map((q) => (
                        <Question
                          key={q.question_id}
                          questionData={q}
                          onChange={(updatedData) =>
                            handleUpdateQuestion(updatedData)
                          }
                          onDelete={() => handleDeleteQuestion(q.question_id)}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </>
              ) : (
                <p>Please select a category to view its questions.</p>
              )}
            </div>
          </>
        ) : (
          <p>Please select a game to view its categories and questions.</p>
        )}
      </div>
    </div>
  );
}
