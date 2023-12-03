from flask import json, Flask, request, jsonify, session
import mysql.connector
import subprocess  # Import the subprocess module
from flask_cors import CORS  # Import CORS
import os 
import subprocess
from dotenv import load_dotenv
from os.path import join, dirname
import requests
from twilio.rest import Client
import random
import bcrypt

app = Flask(__name__)

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)

#************************ SOME IMPORTANT SECRET KEYs *****************
SEC_EC_KEY = "vilassairajtushar"
API_SEC_KEY = "RFDnwcYWFXjYbKm1UqTrRaUnFyximFGE"
ACC_SID = "AC68b8fb29a4a359d8091eda075d0315e9"
AUTH_TOKEN = "dd3ef75a12eb779f6dd69f9cce1b3778"
TWILIO_NUMBER = "+13343669183"
# DB_PASS = os.environ.get("DB_PASS")
# DB_NAME = os.environ.get("DB_NAME")

app.secret_key = SEC_EC_KEY # Secret Key on which we are storing sessions, Something like Encryption Key


#************** MySQL Connection ****************
conn = mysql.connector.connect( 
    host="localhost",
    user="root",
    password="Sai@121530",
    database="votingsample"
)
cursor = conn.cursor()



def updateSampleJS(candidateNames, duration):
    # Define the content to be written to "sample.js" 
    # duration = 2
    js_content = f'const a = {candidateNames};\nconst b = {duration};\n\nmodule.exports = {{ a, b }};\n'

    # Set the directory where "sample.js" is located
    # directory_path = 'E:/Block chain project/scripts'
    directory_path = "E:/Block chain project/scripts"
    # Change the current working directory to the specified directory
    os.chdir(directory_path) 

    # Write the updated content to "sample.js"
    with open("sample.js", "w") as js_file:
        js_file.write(js_content)




def makeRun(candidateNames, duration):
    # Set the directory where your Node.js script is located
    print('inside makeRun functions')
    # directory_path = 'E:/Block chain project'
    directory_path = 'E:/Block chain project'
    updateSampleJS(candidateNames, duration)
    print('line 66')
    # Define the Node.js command to run your script with lowercase arguments
    command = f'npx hardhat run scripts/deploy.js --network sepolia'
    command1 = f'npx hardhat compile'
    r1 = subprocess.run(command1,shell=True,stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print('line 68')
    # Use the os module to change the current working directory
    os.chdir(directory_path)

    print('line 71')
    # Use subprocess to run the Node.js command
    print('Command:', command)
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print('function exit succesfully')
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



#********************* Start Election ****************************
@app.route('/start-election', methods=['POST'])
def start_election():
    try:
        print('inside the function start election')
        data = request.get_json()  # Receive data from the POST request
        candidate_names = data.get("candidateNames")
        duration = data.get("duration")
        add_data(candidate_names,duration)
        print(candidate_names) 
        print(duration)
        deploy_script_path = 'E:/Block chain project/scripts/deploy.js'  # Replace with the actual path to deploy.js
        makeRun(candidate_names,duration)
        return jsonify({"message": "Election started successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#************************* Add candidates *****************************
def giveCandidateId():
    return random.randrange(100000, 999999)


def add_data(candidate_names, electionDuration):
    votes = 0

    try:
        # Establish a database connection and cursor
        with conn.cursor() as cursor:
            print('i entered from first delete query')
            delete_query = "DELETE FROM voted_to"
            cursor.execute(delete_query)
            print('both of these queries get executed')
            # Commit the changes to the database
            # conn.commit()

            # Delete existing data from the 'candidate' table
            delete_query = "DELETE FROM candidate"
            cursor.execute(delete_query) 
            # conn.commit()
            # Delete existing data from the 'voted_to' table
            print('here the delete queries executed succesfully')
            if electionDuration is None or candidate_names is None:
                return jsonify({"error": "Missing election duration or candidates"}), 400

            candidate_id_list = [giveCandidateId() for _ in candidate_names]

            for candidate_id, candidate_name in zip(candidate_id_list, candidate_names):
                # Use parameterized queries to prevent SQL injection
                insert_query = "INSERT INTO candidate VALUES (%s, %s, %s)"
                values = (candidate_id, candidate_name, votes)
                cursor.execute(insert_query, values)

            # Commit the changes to the database
            conn.commit()
    except Exception as e:
        # Handle exceptions, log the error, and return an error response
        return jsonify({"error": f"Failed to insert data: {str(e)}"}), 500
    finally:
        # Close the database connection
        conn.close()


#*********************** Verifying Admin ************************ 
@app.route('/verify', methods=['POST'])
def verify():
    try:
        # Get user-submitted data from the form
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        print("entered into the verify function")
        # Execute a SQL query to check if the data is present in the database
        query = "SELECT * FROM adminI WHERE name = %s AND password = %s"
        cursor.execute(query, (username, password))
        result = cursor.fetchone()
        print("your query is executed succesfully for admin verification")
        print(result)
        if result:
            # Data is present in the database
            print("your query is executed succesfully for admin verification")
            return jsonify({"message": "Data is present in the database"})
        else:
            # Data is absent in the database
            return jsonify({"message": "Data is not found in the database", "code":403})

    except Exception as e:
        return jsonify({"error": str(e), "code":404})



#********** generate OTP: ***********
def generateOTP():
    return random.randrange(100000, 999999) # 6-digit OTP

#************************ Verify addhar no. ************************
@app.route('/adharVerify', methods=['POST'])
def adharVerify():
    try:
        OTP = generateOTP()
        print(OTP)
        #Getting aadhar no. inputed in client
        data = request.get_json()
        adhar = data.get('adhar')
        print(data) 
        print(adhar)
         # finding mobile no. linked with aadhar no.
        query = "SELECT mobileno FROM aadhar WHERE id = %s"
        print(query)
        values = (adhar,)
        cursor.execute(query, values)
        mobile = cursor.fetchone()
        print(mobile)
        phone=str(mobile[0])    
        print("phone is "+phone)  
        print(ACC_SID) 
        print(AUTH_TOKEN)
        client = Client(ACC_SID, AUTH_TOKEN)
        print(client)
        body = "pappa he otp ahe  " + str(OTP)
        print(body)
        original_string = "+"+phone
        print(original_string)
        # Pushing OTP in session for verifying later
        session['response'] = str(OTP)  

        #sending message to Phone number
        message = client.messages.create( 
            from_=TWILIO_NUMBER,
            body=body,
            to=original_string
        )
        print(message)

        # some validations 
        if message:
            return jsonify({"status":200, "message":"Successfully sent OTP"})
        else:
            return jsonify({"status":400, "message": "Failed"})

        # print(message)
    except Exception as e:
        return jsonify({"error": str(e), "code": 404})



#************************* Verify OTP **********************************
@app.route('/verifyOTP', methods=['POST'])
def verifyOTP():
    try:
        #getting otp inputed in client
        data = request.get_json()
        otp = data.get('otp')
        

        #Checking otp stored in session is equal to otp or not:
        if 'response' in session:
            ses = session['response']
            session.pop('response', None)
            if ses == otp:
                return jsonify({"status":200, "message":"Verified"})
            else:
                return jsonify({"status":403, "message":"Invalid"})
    
    except Exception as e:
        return jsonify({"error": str(e), "code": 404})



#*********************** Delete Operation ***************************
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_data(id):
    try:
        delete_query = "DELETE FROM admin WHERE id = %s"
        cursor.execute(delete_query, (id,))
        conn.commit()

        return jsonify({"message": "Data deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e), "code":500})  # 500 for Internal Server Error


@app.route('/register_transaction',methods=['POST']) 
def register():
    try:
        print('entered inside registered function') 
        data = request.get_json()
        print(data) 
        id = data.get('id')
        id_str = str(id)  # New variable to hold the string representation of id
        candidate_name = data.get('candidate')['name']
        print(candidate_name)
        # Execute the query to get candidate_id based on candidate_name
        query = "SELECT candidate_id FROM candidate WHERE candidate_name = %s" 
        print('query to be executed') 
        values = (candidate_name,)
        print(candidate_name)
        cursor.execute(query, values)
        candidate = cursor.fetchone()

        voter_hashed_id = ''
        if candidate:
            # Candidate found, proceed with the insert query
            
            bytes_id = id_str.encode('utf-8')
            salt = bcrypt.gensalt()
            print('inside if statemetn') 

            # Hashing the id
            voter_hashed_id_bytes = bcrypt.hashpw(bytes_id, salt)
            voter_hashed_id = voter_hashed_id_bytes.decode('utf-8')  # Convert bytes to string
            insert_query = "INSERT INTO voted_to(voter_id,candidate_name) VALUES (%s, %s)"
            # Assuming id is the same for both vote_id and voter_id
            values = (voter_hashed_id, str(candidate[0]))  # Assuming candidate_id is the first column 
            cursor.execute(insert_query, values)
            print('insert query executed')
            # Commit the changes to the database
            conn.commit()

            return jsonify({"status": 200,"message": "Transaction recorded successfully","voter_hashed_id": voter_hashed_id})

        else:
            return jsonify({"status": 404, "message": "Candidate not found"})

    except mysql.connector.Error as err:
        return jsonify({"status": 500, "message": f"Database error: {err}"})
 

@app.route('/fetch_voted_data', methods=['GET']) 
def fetch_voted_data(): 
    try:
        print('inside fetch data function') 
        voter_id_query = "SELECT voter_id FROM voted_to"
        candidate_name_query = "SELECT candidate_name FROM voted_to"

        cursor.execute(voter_id_query) 
        voter_ids = [result[0] for result in cursor.fetchall()] 
        print(voter_ids) 

        cursor.execute(candidate_name_query) 
        candidate_names = [result[0] for result in cursor.fetchall()] 
        print(candidate_names) 

        response_data = {
            "status": 200,
            "message": "Transaction recorded successfully",
            "voter_ids": voter_ids,
            "candidate_names": candidate_names
        }
        print('end of fetch data function')

    except Exception as e:
        response_data = {
            "status": 500, 
            "message": f"Error: {str(e)}"
        }

    return jsonify(response_data)  # Corrected the return statement
#******************* Just Kidding ********************************
@app.route('/')
def hello_world():
    return "<p>Hello Vilas </>"        


if __name__ == '__main__':
    app.run(debug=True)
