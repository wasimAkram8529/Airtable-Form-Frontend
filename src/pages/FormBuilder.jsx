import React, { useEffect, useState } from "react";
import { apiGet, apiPost, BACKEND_URL } from "../api";
import ConditionalRuleEditor from "../components/ConditionalRuleEditor";

const buttonStyle = {
  padding: "8px 14px",
  cursor: "pointer",
  background: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "4px",
};

export default function FormBuilder() {
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("My Form");
  const [formId, setFormId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/airtable/bases")
      .then((res) => {
        if (res?.unauthorized) {
          setError("You are not logged in with Airtable.");
          return;
        }
        setBases(res);
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load Airtable bases.");
      });
  }, []);

  useEffect(() => {
    if (!selectedBase) return;
    apiGet(`/airtable/bases/${selectedBase}/tables`)
      .then(setTables)
      .catch(console.error);
  }, [selectedBase]);

  useEffect(() => {
    if (!selectedBase || !selectedTable) return;
    apiGet(`/airtable/bases/${selectedBase}/tables/${selectedTable}/fields`)
      .then(setFields)
      .catch(console.error);
  }, [selectedBase, selectedTable]);

  const addQuestionFromField = (field) => {
    const typeMap = {
      singleLineText: "shortText",
      longText: "longText",
      singleSelect: "singleSelect",
      multipleSelects: "multiSelect",
      multipleAttachments: "attachment",
    };

    const q = {
      questionKey: field.id,
      airtableFieldId: field.id,
      label: field.name,
      type: typeMap[field.type],
      required: false,
      options: field.options?.choices?.map((c) => c.name) || [],
      conditionalRules: null,
    };
    setQuestions((prev) => [...prev, q]);
  };

  const saveForm = async () => {
    try {
      const res = await apiPost("/forms", {
        airtableBaseId: selectedBase,
        airtableTableId: selectedTable,
        title,
        description: "",
        questions,
      });
      setFormId(res._id);
      alert("Form saved successfully");
    } catch (e) {
      console.error(e);
      alert("Error creating form");
    }
  };

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/airtable/login`;
  };

  // const handleEnableSync = async () => {
  //   try {
  //     await apiPost("/webhook-setup/register", {
  //       baseId: selectedBase,
  //       tableId: selectedTable,
  //     });

  //     alert("Airtable Sync with DB has been enabled successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to enable sync. Please try again.");
  //   }
  // };

  if (error && bases.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Unauthorized</h3>
        <p>{error}</p>
        <button style={buttonStyle} onClick={handleLogin}>
          Login with Airtable
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <button
        style={{ marginBottom: 20, padding: "6px 12px" }}
        onClick={() => (window.location.href = "/dashboard")}
      >
        Go to Dashboard
      </button>
      {/* <button
        disabled={!selectedBase || !selectedTable}
        onClick={handleEnableSync}
      >
        Enable Airtable Sync with DB
      </button> */}

      <h2 style={{ marginBottom: 20 }}>Form Builder</h2>

      <div style={{ marginBottom: 16 }}>
        <label>Form Title:</label>
        <input
          style={{ width: "100%", padding: 6, marginTop: 4 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Airtable Base:</label>
        <select
          style={{ width: "100%", padding: 6, marginTop: 4 }}
          value={selectedBase}
          onChange={(e) => {
            setSelectedBase(e.target.value);
            setSelectedTable("");
            setFields([]);
            setQuestions([]);
          }}
        >
          <option value="">Select base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBase && (
        <div style={{ marginBottom: 16 }}>
          <label>Airtable Table:</label>
          <select
            style={{ width: "100%", padding: 6, marginTop: 4 }}
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setFields([]);
              setQuestions([]);
            }}
          >
            <option value="">Select table</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {fields.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3> Available Fields</h3>
          {fields.map((f) => (
            <div key={f.id} style={{ marginBottom: 6 }}>
              {f.name} ({f.type}){" "}
              <button
                style={buttonStyle}
                onClick={() => addQuestionFromField(f)}
              >
                Add as question
              </button>
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3> Questions</h3>
          {questions.map((question, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 10,
                marginBottom: 10,
                background: "#fafafa",
              }}
            >
              <input
                style={{ width: "95%", padding: 6 }}
                value={question.label}
                onChange={(e) => {
                  const copy = [...questions];
                  copy[idx].label = e.target.value;
                  setQuestions(copy);
                }}
              />
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Type: {question.type}
              </div>

              <label style={{ display: "block", marginTop: 6 }}>
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[idx].required = e.target.checked;
                    setQuestions(copy);
                  }}
                />{" "}
                Required
              </label>

              <ConditionalRuleEditor
                questions={questions.filter((_, i) => i !== idx)}
                rules={question.conditionalRules}
                onChange={(newRules) => {
                  const updated = [...questions];
                  updated[idx].conditionalRules = newRules;
                  setQuestions(updated);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <button
        style={{ ...buttonStyle, width: "100%", marginBottom: 20 }}
        disabled={!selectedTable || questions.length === 0}
        onClick={saveForm}
      >
        Save Form
      </button>

      {formId && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <h4>Your form is ready</h4>
          <button
            style={buttonStyle}
            onClick={() =>
              window.open(
                `${window.location.origin}/form/${formId}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Open Form
          </button>
          <button
            style={{ ...buttonStyle, marginLeft: 10 }}
            onClick={() =>
              window.open(
                `${window.location.origin}/forms/${formId}/responses`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            View Responses
          </button>
        </div>
      )}
    </div>
  );
}
