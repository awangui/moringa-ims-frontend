import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UploadDocuments() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get vendor ID from URL

    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("vendorDocumentName", documentName);
        formData.append("vendorDocumentType", documentType);

        try {
            const response = await fetch(`http://172.236.2.18:5555/vendors/${id}/documents`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload document");
            }

            alert("Document uploaded successfully");
            navigate(`/vendors/${id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <form className="vendorForm row g-3" onSubmit={handleUpload} encType="multipart/form-data">
                <h3 style={{ textAlign: "center" }}>Add Document</h3>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="col-md-12">
                    <label htmlFor="documentName" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="documentName"
                        placeholder="e.g Contract Document"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                    />
                </div>

                <div className="col-12">
                    <label htmlFor="documentType" className="form-label">Type</label>
                    <input
                        type="text"
                        className="form-control"
                        id="documentType"
                        placeholder="e.g PDF, Excel"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="fileUpload" className="form-label">Upload File</label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileUpload"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary">Upload Document</button>
                </div>

                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/vendors/${id}`)}>
                    Back
                </button>
            </form>
        </div>
    );
}

export default UploadDocuments;
