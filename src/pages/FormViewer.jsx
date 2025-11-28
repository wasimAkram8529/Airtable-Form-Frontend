import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";
import QuestionField from "../components/QuestionField";

function shouldShowQuestion(rules, answers) {
  if (!rules || !rules.conditions || rules.conditions.length === 0) return true;

  const evaluateCondition = (condition) => {
    const ans = answers[condition.questionKey];
    if (ans === undefined || ans === null) return false;
    switch (condition.operator) {
      case "equals":
        return ans === condition.value;
      case "notEquals":
        return ans !== condition.value;
      case "contains":
        if (Array.isArray(ans)) return ans.includes(condition.value);
        if (typeof ans === "string")
          return ans.includes(String(condition.value));
        return false;
      default:
        return false;
    }
  };

  const results = rules.conditions.map(evaluateCondition);
  return rules.logic === "AND" ? results.every(Boolean) : results.some(Boolean);
}

export default function FormViewer({ readOnly }) {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    apiGet(`/forms/${formId}`)
      .then(setForm)
      .catch((error) => {
        console.error(error);
        alert("Error loading form");
      });
  }, [formId]);

  const visibleQuestions = useMemo(() => {
    if (!form) return [];
    return form.questions.filter((question) =>
      shouldShowQuestion(question.conditionalRules, answers)
    );
  }, [form, answers]);

  const validateField = (question, val) => {
    if (
      question.required &&
      (!val || (Array.isArray(val) && val.length === 0))
    ) {
      return `${question.label} is required`;
    }

    if (question.label.toLowerCase().includes("email")) {
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return `Enter a valid email`;
      }
    }

    if (question.label.toLowerCase().includes("url") && val) {
      try {
        new URL(val);
      } catch {
        return `Enter a valid URL`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!form) return;
    const errs = [];

    for (const question of visibleQuestions) {
      const err = validateField(question, answers[question.questionKey]);
      if (err) errs.push(err);
      const val = answers[question.questionKey];
      if (
        question.required &&
        (val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0))
      ) {
        errs.push(`${question.label} is required`);
      }
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    try {
      console.log(answers);
      const res = await apiPost(`/forms/${formId}/responses`, { answers });
      alert("Submitted!");
      console.log(res);
    } catch (error) {
      console.error(error);
      alert("Submission error");
    }
  };

  if (!form) return <div style={{ padding: 20 }}>Loading...</div>;

  if (readOnly) {
    return (
      <div style={{ padding: 20 }}>
        <h2>{form.title} (Preview Mode)</h2>
        {visibleQuestions.map((question) => (
          <QuestionField
            key={question.questionKey}
            question={question}
            value={""}
            onChange={() => {}}
            disabled
          />
        ))}
        <p style={{ marginTop: 20, color: "gray" }}>
          Submit disabled in preview mode.
        </p>
      </div>
    );
  } else {
    return (
      <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 16 }}>{form.title}</h2>

        {errors.length > 0 && (
          <ul style={{ color: "red", marginBottom: 16 }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}

        {visibleQuestions.map((question) => (
          <QuestionField
            key={question.questionKey}
            question={question}
            value={answers[question.questionKey]}
            onChange={(val) =>
              setAnswers((prev) => ({
                ...prev,
                [question.questionKey]: val,
              }))
            }
          />
        ))}

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 10,
            padding: "8px 16px",
            cursor: "pointer",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          Submit
        </button>
      </div>
    );
  }
}
