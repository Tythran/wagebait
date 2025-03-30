import React, { useState, useEffect } from "react";
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

const fetchUser = async (): Promise<string | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data?.user?.id || null;
};

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

export default function Game({ game, onEdit, onDelete, onRename, isActive }: GameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(game.game_title);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const id = await fetchUser();
      setUserId(id);
    };
    getUser();
  }, []);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== game.game_title) {
      await updateGame(game.game_id, trimmed);
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`p-3 mb-2 rounded d-flex justify-content-between align-items-center shadow-sm transition-all hover-scale ${
        isActive
          ? "bg-primary bg-opacity-25 border border-primary text-white"
          : "bg-dark text-light border border-secondary hover:border-primary"
      }`}
    >
      {isEditing ? (
        <input
          className="form-control form-control-sm bg-dark text-light border-secondary me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span className="fw-semibold flex-grow-1 me-2" role="button" onClick={onEdit}>
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
