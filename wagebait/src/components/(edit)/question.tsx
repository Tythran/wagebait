import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionData } from "../../app/edit/page";

interface Props {
  questionData: QuestionData;
  onChange: (updated: QuestionData) => void;
  onDelete: () => void;
}

export default function Question({ questionData, onChange, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(
    questionData.question_id.startsWith("new-")
  );
  const [localData, setLocalData] = useState({ ...questionData });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: questionData.question_id,
    });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const options = [
    { text: localData.option_1, isCorrect: localData.correct_1 },
    { text: localData.option_2, isCorrect: localData.correct_2 },
    { text: localData.option_3, isCorrect: localData.correct_3 },
    { text: localData.option_4, isCorrect: localData.correct_4 },
  ];

  const handleOptionChange = (index: number, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      [`option_${index + 1}`]: value,
    }));
  };

  const toggleCorrect = (index: number) => {
    const key = `correct_${index + 1}` as keyof QuestionData;
    setLocalData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onChange(localData);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-dark text-light p-4 mb-4 rounded-3 shadow-lg border border-secondary hover:border-primary transition-all hover-scale"
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label
          className="form-label text-white mb-0"
          {...attributes}
          {...listeners}
        >
          <i className="bi bi-grip-vertical me-2" /> Question
        </label>
        <div>
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
      </div>
      <input
        type="text"
        className="form-control mb-2 bg-dark text-light border-secondary focus-ring"
        value={localData.question_text}
        onChange={(e) =>
          setLocalData({ ...localData, question_text: e.target.value })
        }
        disabled={!isEditing}
      />
      {options.map((opt, i) => (
        <div className="input-group mb-1" key={i}>
          <div className="input-group-text bg-dark border-secondary">
            <input
              type="checkbox"
              className="form-check-input mt-0 cursor-pointer"
              checked={opt.isCorrect}
              onChange={() => toggleCorrect(i)}
              disabled={!isEditing}
            />
          </div>
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary focus-ring"
            value={opt.text || ""}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            disabled={!isEditing}
          />
        </div>
      ))}

      {isEditing && (
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-outline-info" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
