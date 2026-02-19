# tableParser.py
from flask import Flask, request, jsonify
import camelot
import os

app = Flask(__name__)

@app.route("/parse-tables", methods=["POST"])
def parse_tables():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save temporarily
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)

    tables_data = []
    try:
        tables = camelot.read_pdf(temp_path, pages="all", flavor="stream")  # stream flavor works better for structured tables
        for table in tables:
            tables_data.append(table.df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify({"tables": tables_data})

if __name__ == "__main__":
    app.run(port=5001)
