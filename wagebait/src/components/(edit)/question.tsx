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
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: questionData.question_id,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleOptionChange = (index: number, value: string) => {
    const options = [...questionData.options];
    options[index] = value;
    onChange({ ...questionData, options });
  };

  const toggleCorrect = (index: number) => {
    const isAlready = questionData.correct.includes(index);
    const correct = isAlready
      ? questionData.correct.filter((i) => i !== index)
      : [...questionData.correct, index];
    onChange({ ...questionData, correct });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-dark text-light p-4 mb-4 rounded-3 shadow-lg border border-secondary hover:border-primary transition-all hover-scale"
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label text-white mb-0" {...attributes} {...listeners}>
          <i className="bi bi-grip-vertical me-2" /> Question
        </label>
        <div>
          <i
            className="bi bi-pencil me-2 text-light opacity-75 hover-opacity"
            role="button"
            onClick={() => setIsEditing(!isEditing)}
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
        value={questionData.question_text || ""}
        onChange={(e) =>
          onChange({ ...questionData, question_text: e.target.value })
        }
        disabled={!isEditing}
      />
      {questionData.options.map((opt, i) => (
        <div className="input-group mb-1" key={i}>
          <div className="input-group-text bg-dark border-secondary">
            <input
              type="checkbox"
              className="form-check-input mt-0 cursor-pointer"
              checked={questionData.correct.includes(i)}
              onChange={() => toggleCorrect(i)}
              disabled={!isEditing}
            />
          </div>
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary focus-ring"
            value={opt || ""}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            disabled={!isEditing}
          />
        </div>
      ))}
    </div>
  );
}
