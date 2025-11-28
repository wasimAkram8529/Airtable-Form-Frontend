import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, BACKEND_URL } from "../api";

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    apiGet(`/forms/${formId}/responses`)
      .then(setResponses)
      .catch((e) => {
        console.error(e);
        alert("Error loading responses");
      });
  }, [formId]);

  const downloadFile = (format) => {
    const url = `${BACKEND_URL}/forms/${formId}/responses/export?format=${format}`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `responses.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  console.log(responses);
  return (
    <div>
      <h2>Responses</h2>
      {responses.map((r) => (
        <div
          key={r.id}
          style={{
            width: 500,
            border: "1px solid #ccc",
            padding: 8,
            marginBottom: 8,
          }}
        >
          <div>ID: {r.id}</div>
          <div>Created: {new Date(r.createdAt).toLocaleString()}</div>
          <div>Status: {r.status}</div>
          <div>
            Answers:
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(r.answers, null, 2)}
            </pre>
          </div>
        </div>
      ))}

      <button onClick={() => downloadFile("json")}>Export JSON</button>
      <button onClick={() => downloadFile("csv")} style={{ marginLeft: 10 }}>
        Export CSV
      </button>
    </div>
  );
}
