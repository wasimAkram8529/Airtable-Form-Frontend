import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function Dashboard() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    apiGet("/forms").then(setForms).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Forms</h2>

      {forms.length === 0 && <p>No forms created yet</p>}

      <ul>
        {forms.map((form) => (
          <li key={form._id} style={{ marginBottom: 10 }}>
            <strong>{form.title}</strong> —{" "}
            {new Date(form.createdAt).toDateString()}
            <div style={{ marginTop: 4 }}>
              <button
                onClick={() => (window.location.href = `/form/${form._id}`)}
              >
                Fill the form
              </button>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => (window.location.href = `/preview/${form._id}`)}
              >
                Preview
              </button>
              <button
                style={{ marginLeft: 8 }}
                onClick={() =>
                  (window.location.href = `/forms/${form._id}/responses`)
                }
              >
                Responses
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
