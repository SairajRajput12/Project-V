from flask import json,Flask, request, jsonify
import mysql.connector
import subprocess  # Import the subprocess module
from flask_cors import CORS  # Import CORS
import os 
import subprocess

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})



# MySQL Connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Sai@121530",
    database="votingsample"
)
cursor = conn.cursor()

def updateSampleJS(candidateNames, duration):
    # Define the content to be written to "sample.js"
    js_content = f'const a = {candidateNames};\nconst b = {duration};\n\nmodule.exports = {{ a, b }};\n'

    # Set the directory where "sample.js" is located
    directory_path = 'E:/Block chain project/scripts'

    # Change the current working directory to the specified directory
    os.chdir(directory_path)

    # Write the updated content to "sample.js"
    with open("sample.js", "w") as js_file:
        js_file.write(js_content)

def makeRun(candidateNames, duration):
    # Set the directory where your Node.js script is located
    print('inside makeRun functions')
    directory_path = 'E:/Block chain project'
    updateSampleJS(candidateNames, duration)
    # Define the Node.js command to run your script with lowercase arguments
    command = f'npx hardhat run scripts/deploy.js --network sepolia'

    # Use the os module to change the current working directory
    os.chdir(directory_path)

    # Use subprocess to run the Node.js command
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print(result)
    if result.returncode == 0:
        print("Command executed successfully")
        print("Output:", result.stdout)
        writeIt(result.stdout)
    else:
        print("Command failed with error code:", result.returncode)
        print("Error message:", result.stderr)

def writeIt(a):
    print('hello')
    file_path = 'E:/Block chain project/artifacts/contracts/VOTING.sol/VOTING.json'
    with open(file_path, 'r') as json_file:
        contract_details1 = json.load(json_file)
    a = a.strip()  # Remove leading/trailing whitespace

    # Split the string by space and get the last element
    parts = a.split(" ")
    contract_address = parts[-1]

    contract_details = {
        "abi": contract_details1["abi"],
        "address": contract_address
    }
    file_path1 = 'E:/Block chain project/votter/src/contractDetails.json'

    # Write the contract details to a JSON file
    with open(file_path1, 'w') as json_file:
        json.dump(contract_details, json_file, indent=4)
    print(f"Contract details saved to {file_path1}")

# makeRun()


@app.route('/start-election', methods=['POST'])
def start_election():
    try:
        print('inside the function start election')
        data = request.get_json()  # Receive data from the POST request
        candidate_names = data.get("candidateNames")
        duration = data.get("duration")
        print(candidate_names) 
        print(duration)
        names = [item['name'].strip() for item in candidate_names]
        # os.chdir('E:\\Block chain project')
        print(names)
        # Perform any necessary validation on the received data
        deploy_script_path = 'E:/Block chain project/scripts/deploy.js'  # Replace with the actual path to deploy.js
        makeRun(names,duration)
        # Execute the external Node.js script with the data as command-line arguments
        # subprocess.check_call(['node', deploy_script_path, json.dumps(candidate_names), str(duration)])

        return jsonify({"message": "Election started successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add', methods=['POST'])
def add_data():
    try:
        data = request.get_json()
        electionDuration = data.get('electionDuration')
        candidates = data.get('candidates')

        if electionDuration is None or candidates is None:
            return jsonify({"error": "Missing election duration or candidates"}), 400

        for candidate in candidates:
            insert_query = "INSERT INTO elections (duration, candidate_id, candidate_name) VALUES (%s, %s, %s)"
            values = (electionDuration, candidate.get('id'), candidate.get('name'))
            cursor.execute(insert_query, values)

        conn.commit()

        return jsonify({"message": "Election data inserted successfully"})
    except Exception as e:
        # Log the error for debugging
        print("Error:", str(e))

        # Return a more specific error message
        return jsonify({"error": "Internal Server Error: Failed to insert data"}), 500

# verify: 
@app.route('/verify', methods=['POST'])
def verify():
    try:
        # Get user-submitted data from the form
        data = request.get_json()
        admin_id = data.get('adminId')
        admin_name = data.get('adminName')
        password = data.get('password')

        # Execute a SQL query to check if the data is present in the database
        query = "SELECT * FROM adminInfo WHERE id = %s AND name = %s AND password = %s"
        cursor.execute(query, (admin_id, admin_name, password))
        result = cursor.fetchone()

        if result:
            # Data is present in the database
            return jsonify({"message": "Data is present in the database"})
        else:
            # Data is absent in the database
            return jsonify({"message": "Data is not found in the database"})

    except Exception as e:
        return jsonify({"error": str(e)})


# Delete Operation
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_data(id):
    try:
        delete_query = "DELETE FROM admin WHERE id = %s"
        cursor.execute(delete_query, (id,))
        conn.commit()

        return jsonify({"message": "Data deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # 500 for Internal Server Error

if __name__ == '__main__':
    app.run(debug=True)
