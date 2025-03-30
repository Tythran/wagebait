import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface GameType {
  game_id: string;
  game_title: string;
  created_by?: string;
}

interface GameProps {
  game: GameType;
  onEdit: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  isActive: boolean;
}

const updateGame = async (id: string, newTitle: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("games")
    .update({ game_title: newTitle })
    .eq("game_id", id);
  if (error) {
    console.error("Error updating game:", error);
  }
  return data;
};

export default function Game({
  game,
  onEdit,
  onDelete,
  onRename,
  isActive,
}: GameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(game.game_title);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== game.game_title) {
      await updateGame(game.game_id, trimmed);
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <div className="d-flex align-items-center flex-grow-1">
      {isEditing ? (
        <input
          className="form-control form-control-sm bg-dark text-light border-secondary me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          className={`fw-semibold me-2 flex-grow-1 ${
            isActive ? "text-white" : "text-light"
          }`}
          role="button"
          onClick={onEdit}
        >
          {game.game_title}
        </span>
      )}
      <i
        className="bi bi-pencil me-2 text-light opacity-75 hover-opacity"
        role="button"
        onClick={() => setIsEditing(true)}
      />
      <i
        className="bi bi-trash text-danger opacity-75 hover-opacity"
        role="button"
        onClick={onDelete}
      />
    </div>
  );
}
