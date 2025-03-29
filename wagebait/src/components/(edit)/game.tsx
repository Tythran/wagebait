import React, { useState } from "react";

interface GameProps {
  game: { id: string; title: string };
  onEdit: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  isActive: boolean;
}

export default function Game({
  game,
  onEdit,
  onDelete,
  onRename,
  isActive,
}: GameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(game.title);

  const handleSave = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== game.title) {
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
        <span
          className="fw-semibold flex-grow-1 me-2"
          role="button"
          onClick={onEdit}
        >
          {game.title}
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
