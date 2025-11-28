import React from "react";

export default function QuestionField({ question, value, onChange }) {
  const handleChange = (e) => onChange(e.target.value);

  if (question.type === "shortText") {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>
          {question.label} {question.required && "*"}
        </label>
        <br />
        <input
          style={{ width: "100%", padding: 6 }}
          value={value || ""}
          onChange={handleChange}
        />
      </div>
    );
  }

  if (question.type === "longText") {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>
          {question.label} {question.required && "*"}
        </label>
        <br />
        <textarea
          style={{ width: "100%", padding: 6 }}
          rows={4}
          value={value || ""}
          onChange={handleChange}
        />
      </div>
    );
  }

  if (question.type === "singleSelect") {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>
          {question.label} {question.required && "*"}
        </label>
        <br />
        <select
          style={{ width: "100%", padding: 6 }}
          value={value || ""}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {question.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (question.type === "multiSelect") {
    const arrValue = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      if (arrValue.includes(opt)) {
        onChange(arrValue.filter((o) => o !== opt));
      } else {
        onChange([...arrValue, opt]);
      }
    };

    return (
      <div style={{ marginBottom: 12 }}>
        <div>
          {question.label} {question.required && "*"}
        </div>
        {question.options?.map((opt) => (
          <label key={opt} style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={arrValue.includes(opt)}
              onChange={() => toggle(opt)}
            />{" "}
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "attachment") {
    return (
      <div style={{ marginBottom: 12 }}>
        <label>
          {question.label} {question.required && "*"}
        </label>
        <br />
        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []).map(
              (file) => file.name
            );
            onChange(files);
          }}
        />
      </div>
    );
  }

  return null;
}
