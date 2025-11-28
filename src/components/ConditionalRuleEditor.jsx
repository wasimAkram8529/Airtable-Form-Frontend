import React from "react";

const OPERATORS = ["equals", "notEquals", "contains"];

export default function ConditionalRuleEditor({ questions, rules, onChange }) {
  const ensureRules = () =>
    rules || {
      logic: "AND",
      conditions: [{ questionKey: "", operator: "equals", value: "" }],
    };

  const updateCondition = (index, key, value) => {
    const updated = ensureRules();
    updated.conditions[index][key] = value;
    onChange({ ...updated });
  };

  const addCondition = () => {
    const updated = ensureRules();
    updated.conditions.push({
      questionKey: "",
      operator: "equals",
      value: "",
    });
    onChange({ ...updated });
  };

  const removeCondition = (index) => {
    const updated = { ...(rules || { logic: "AND", conditions: [] }) };
    updated.conditions.splice(index, 1);
    if (updated.conditions.length === 0) {
      onChange(null);
    } else {
      onChange(updated);
    }
  };

  const logic = rules?.logic || "AND";
  const conditions = rules?.conditions || [];

  return (
    <div style={{ borderTop: "1px solid #ddd", marginTop: 10, paddingTop: 8 }}>
      <strong>Conditional Visibility</strong>

      {conditions.map((condition, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          <select
            style={{ flex: 2, padding: 4 }}
            value={condition.questionKey}
            onChange={(e) =>
              updateCondition(idx, "questionKey", e.target.value)
            }
          >
            <option value="">Select question</option>
            {questions.map((question) => (
              <option key={question.questionKey} value={question.questionKey}>
                {question.label}
              </option>
            ))}
          </select>

          <select
            style={{ flex: 1, padding: 4 }}
            value={condition.operator}
            onChange={(e) => updateCondition(idx, "operator", e.target.value)}
          >
            {OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>

          <input
            style={{ flex: 2, padding: 4 }}
            placeholder="Value"
            value={condition.value}
            onChange={(e) => updateCondition(idx, "value", e.target.value)}
          />

          <button
            type="button"
            onClick={() => removeCondition(idx)}
            style={{
              padding: "4px 8px",
              background: "#e53935",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addCondition}
        style={{
          marginTop: 8,
          padding: "6px 10px",
          cursor: "pointer",
          borderRadius: 4,
          marginLeft: 10,
          border: "1px solid #ccc",
          background: "#f5f5f5",
        }}
      >
        + Add Condition
      </button>

      {conditions.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <label>Logic: </label>
          <select
            value={logic}
            onChange={(e) =>
              onChange({
                logic: e.target.value,
                conditions,
              })
            }
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      )}
    </div>
  );
}
