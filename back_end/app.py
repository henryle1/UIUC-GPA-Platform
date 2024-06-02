from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import uuid
from urllib.parse import unquote
from collections import defaultdict
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

users = {}
courses = defaultdict(list) 
professors = {}
comments = {}

with open('uiuc-gpa-dataset.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        course_key = f"{row['Subject']}{row['Number']}"
        courses[course_key.lower()].append(row) 

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if username in users:
        return jsonify({'message': 'User already exists'}), 409
    else:
        hashed_password = generate_password_hash(password)
        users[username] = {'password': hashed_password, 'email': email}
        return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if username in users:
        if check_password_hash(users[username]['password'], password):
            return jsonify({'message': 'Login successful', 'username': username}), 200
        else:
            return jsonify({'message': 'Invalid password'}), 401
    else:
        return jsonify({'message': 'Invalid username'}), 401

@app.route('/find_course/', methods=['GET'])
def find_course():
    query = unquote(request.args.get('query', '')).lower()
    professor_distributions = defaultdict(lambda: defaultdict(int))
    professor_student_totals = defaultdict(int)

    for course_instance in courses.get(query, []):
        professor = course_instance['Primary Instructor']
        for grade in ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W']:
            count = int(course_instance.get(grade, 0))
            professor_distributions[professor][grade] += count
            professor_student_totals[professor] += count

    if not professor_distributions:
        return jsonify({'message': f"No courses found for query: {query}"}), 404

    results = {
        'subject': query.upper(),
        'professors': {}
    }
    for professor, grade_totals in professor_distributions.items():
        total_students = professor_student_totals[professor]
        if total_students > 0:
            grade_percentages = {
                grade: (grade_totals[grade] / total_students) * 100 for grade in grade_totals
            }
            results['professors'][professor] = {
                'average_grade_distribution_percentage': grade_percentages,
                'total_students': total_students
            }

    return jsonify(results), 200

@app.route('/find_professor/', methods=['GET'])
def find_professor():
    query = unquote(request.args.get('query', '')).lower()
    results = []
    professor_courses = defaultdict(list)  

    for course_key, course_instances in courses.items():
        for instance in course_instances:
            prof_name = instance['Primary Instructor']
            if query in prof_name.lower():  
                professor_courses[prof_name].append(course_key.upper())  

    for professor_name, course_list in professor_courses.items():
        results.append({'name': professor_name, 'courses': sorted(set(course_list))})  

    if not results:
        return jsonify({'message': 'No professor found matching the query'}), 404

    return jsonify(results), 200


@app.route('/add_comment/', methods=['POST'])
def add_comment():
    data = request.get_json()
    name = data.get('name')
    comment = data.get('comment')
    
    if not all([name, comment]):
        return jsonify({'message': 'Missing required fields'}), 400
    
    print(f"Received comment for {name}: {comment}")  
    return jsonify({'message': 'Comment added successfully'})

if __name__ == '__main__':
    app.run(debug=True)