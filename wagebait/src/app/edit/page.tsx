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
  options: string[];
  correct: number[];
}


export default function EditPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categoriesByGame, setCategoriesByGame] = useState<{ [key: string]: Category[] }>({});
  const [questionsByCategory, setQuestionsByCategory] = useState<{ [key: string]: QuestionData[] }>({});
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {

        const { data: userData, error: userError } = await supabase.auth.getUser();
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
  

        const { data: categoriesData, error: categoriesError } = await supabase.from("category").select("*");
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
  

        const { data: questionsData, error: questionsError } = await supabase.from("question").select("*");
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
            options: q.options || ["", "", "", ""],
            correct: q.correct || [],
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


      const { data: updatedGames, error: fetchError } = await supabase.from("games").select("*").eq("created_by", userId);
      if (fetchError) {
        console.error("Error fetching updated games:", fetchError);
        return;
      }
      setGames(updatedGames || []);
    } catch (exception) {
      console.error("Unexpected error adding game:", exception);
    }}

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
        const updatedGame = updatedGames.find((game: Game) => game.game_id === gameId);
        setSelectedGame(updatedGame);
      }
    } catch (exception) {
      console.error("Unexpected error renaming game:", exception);
    }
  };
  const handleDeleteGame = async (gameId: string) => {
    try {

      const { error } = await supabase.from("games").delete().eq("game_id", gameId);
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
    if (!categoryName || typeof categoryName !== 'string') {
      console.error('Invalid category name');
      return;
    }
  
    try {

      const { error } = await supabase.from('category').insert({
        category_name: categoryName,
        game_id: selectedGame?.game_id, 
      });
  
      if (error) {
        console.error('Error adding category:', error);
        return;
      }
  
      console.log('Category added successfully!');

      if (selectedGame) {
        const { data: updatedCategories, error: fetchError } = await supabase
          .from('category')
          .select('*')
          .eq('game_id', selectedGame.game_id);
  
        if (fetchError) {
          console.error('Error fetching updated categories:', fetchError);
          return;
        }
  
        setCategoriesByGame((prev) => ({
          ...prev,
          [selectedGame.game_id]: updatedCategories,
        }));
      }
    } catch (exception) {
      console.error('Unexpected error adding category:', exception);
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

      const updatedCategories = (categoriesByGame[selectedGame.game_id] || []).map((cat) =>
        cat.category_id === editingCategory ? { ...cat, category_name: editedCategoryName } : cat
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

      const updatedCategories = (categoriesByGame[selectedGame.game_id] || []).filter(
        (cat) => cat.category_id !== categoryId
      );
      setCategoriesByGame({
        ...categoriesByGame,
        [selectedGame.game_id]: updatedCategories,
      });
      console.log("Category deleted successfully!");
    } catch (exception) {
      console.error("Unexpected error deleting category:", exception);
    }
  };
    
  const handleAddQuestion = async (questionData: QuestionData) => {
    if (!activeCategory) {
      console.error('No active category selected.');
      return;
    }
  
    try {

      const { error } = await supabase.from('question').insert({
        category_id: activeCategory,
        question_text: questionData.question_text,
        option_1: '',
        option_2: '',
        option_3: '',
        option_4: '',
        correct_1: false,
        correct_2: false,
        correct_3: false,
        correct_4: false,
      });
  
      if (error) {
        console.error('Error adding question:', error);
        return;
      }
  
      console.log('Question added successfully!');

      const { data: updatedQuestions, error: fetchError } = await supabase
        .from('question')
        .select('*')
        .eq('category_id', activeCategory);
  
      if (fetchError) {
        console.error('Error fetching updated questions:', fetchError);
        return;
      }

      const transformedQuestions: QuestionData[] = (updatedQuestions || []).map((q: { question_id: string; category_id: string; question_text?: string; option_1?: string; option_2?: string; option_3?: string; option_4?: string; correct_1?: boolean; correct_2?: boolean; correct_3?: boolean; correct_4?: boolean; }) => ({
        question_id: q.question_id,
        category_id: q.category_id,
        question_text: q.question_text ?? "",
        options: [
          q.option_1 ?? "",
          q.option_2 ?? "",
          q.option_3 ?? "",
          q.option_4 ?? "",
        ],
        correct: [
          ...(q.correct_1 ? [0] : []),
          ...(q.correct_2 ? [1] : []),
          ...(q.correct_3 ? [2] : []),
          ...(q.correct_4 ? [3] : []),
        ],
      }));

      setQuestionsByCategory({
        ...questionsByCategory,
        [activeCategory]: transformedQuestions,
      });
    } catch (exception) {
      console.error('Unexpected error adding question:', exception);
    }
  };
  
  
  
  
  const handleUpdateQuestion = async (updatedQuestion: QuestionData) => {

    if (!selectedGame || !activeCategory) {
      console.error("Error: No game or category selected!");
      return;
    }

    const { error } = await supabase
      .from("question")
      .update({
        question_text: updatedQuestion.question_text,
        option_1: updatedQuestion.options[0],
        option_2: updatedQuestion.options[1],
        option_3: updatedQuestion.options[2],
        option_4: updatedQuestion.options[3],
        correct_1: updatedQuestion.correct.includes(0),
        correct_2: updatedQuestion.correct.includes(1),
        correct_3: updatedQuestion.correct.includes(2),
        correct_4: updatedQuestion.correct.includes(3),
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


return (
  <div className="d-flex vh-100 bg-dark text-light animate__animated animate__fadeIn">

    <div className="border-end border-secondary p-3" style={{ width: "300px" }}>
      <h4 className="d-flex justify-content-between align-items-center">
        Games{" "}
        <i
          className="bi bi-plus"
          role="button"
          onClick={() => {
            handleAddGame();
                    }}
        ></i>
      </h4>
      <div className="list-group mt-3">
        {games.map((game) => (
          <Game
          key={game.game_id}
          game={game}
          isActive={selectedGame?.game_id === game.game_id}
          onEdit={() => {
            setSelectedGame(game);
            const gameCategories = categoriesByGame[game.game_id] || [];
            setActiveCategory(gameCategories[0]?.category_id || "");
          }}
          onDelete={() => handleDeleteGame(game.game_id)}
          onRename={(newTitle) => handleRenameGame(game.game_id, newTitle)}
        />
        
        ))}
      </div>
    </div>

    <div className="flex-grow-1 p-4">
      {selectedGame ? (
        <>
          <h3>{selectedGame.game_title}</h3>

          <div className="mb-4">
            <h5>Categories</h5>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {(categoriesByGame[selectedGame.game_id] || []).map((cat) => (
                <div key={cat.category_id} className="d-flex align-items-center">
                  <button
                    className={`btn ${
                      activeCategory === cat.category_id
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setActiveCategory(cat.category_id)}
                  >
                    {cat.category_name}
                  </button>
                  <i
                    className="bi bi-pencil-square ms-1"
                    role="button"
                    onClick={() => {
                      setEditingCategory(cat.category_id);
                      setEditedCategoryName(cat.category_name);
                    }}
                  ></i>
                  <i
                    className="bi bi-trash ms-1"
                    role="button"
                    onClick={() => handleDeleteCategory(cat.category_id)}
                  ></i>
                </div>
              ))}
              <button
                className="btn btn-primary"
                onClick={() => handleAddCategory("New Category Name")}
              >
                Add Category
              </button>
            </div>
            {editingCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  className="form-control w-50 d-inline-block me-2"
                  placeholder="New category name"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <button
                  className="btn btn-outline-info"
                  onClick={handleRenameCategory}
                >
                  Rename Category
                </button>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => {
                    setEditingCategory(null);
                    setEditedCategoryName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h5>Questions</h5>
            {activeCategory ? (
              <>
                <button
                  className="btn btn-outline-success mb-2"
                  onClick={() =>
                    handleAddQuestion({
                      question_id: "", 
                      category_id: activeCategory,
                      question_text: "New Question",
                      options: ["", "", "", ""],
                      correct: [],
                    })
                  }
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