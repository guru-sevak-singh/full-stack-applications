from flask import Flask, render_template, redirect, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import login_user, current_user, UserMixin, login_required, logout_user, LoginManager
import os
import pandas as pd
from datetime import datetime, date


db_location = f"sqlite:///{os.getcwd()}\\database.sqlite"

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = db_location
app.config['SECRET_KEY'] = 'my secret key...'

db = SQLAlchemy(app=app)
migration = Migrate(app=app, db=db)

login_manager = LoginManager(app=app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_uesr(user_id):
    user = db.get_or_404(User, user_id)
    return user


# ##############################################
# ################# MODELS #####################
# ##############################################

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.Text)
    login_id = db.Column(db.Text, unique=True, index=True)
    password = db.Column(db.Text)

with app.app_context():
    db.create_all()

@app.route('/')
@login_required
def home():
    daterange = request.args.get('daterange')
    print(daterange)
    if daterange == None or daterange == "":
        start_date = datetime.now()
        start_date = start_date.strftime("%d/%b/%Y")
        end_date = start_date
        daterange = f"{start_date} - {end_date}"
    
    age = request.args.get('age')
    if age == None:
        age = ""
    
    gender = request.args.get('gender')
    if gender == "":
        gender = ""


    print(daterange)

    return render_template('index.html', daterange=daterange, age=age, gender=gender)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login_id = request.form.get('login-id')
        password = request.form.get('password')

        user = User.query.filter(User.login_id == login_id).first()
        if user == None:
            flash('No User with this Login')
        
        else:
            if password == user.password:
                login_user(user=user)
                return redirect('/')
            else:
                flash('Password is Incorrect !')
        
        return redirect('login')
    
    return render_template('login.html')

@app.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        name = request.form.get('name')
        login_id = request.form.get('login-id')
        password = request.form.get('password')
        retype_password = request.form.get('retype-password')

        if retype_password == password:
            try:
                user = User(name=name, login_id=login_id, password=password)
                db.session.add(user)
                db.session.commit()
                flash('User is Created Successfully...')

            except:
                flash('User is Already There, Login with This user !')

            return redirect('login')
        
        else:
            flash('password and retype password are same try again')

    return render_template('sign-up.html')

@app.route('/get-data')
@login_required
def get_data():
    daterange = request.args.get('daterange')
    
    print('\n\n\n =>', daterange)


    start_date = daterange.replace(" ", '').split("-")[0]
    date1 = datetime.strptime(start_date, "%d/%b/%Y")
    date1 = date(date1.year, date1.month, date1.day)
    
    end_date = daterange.replace(" ", '').split("-")[1]
    date2 = datetime.strptime(end_date, "%d/%b/%Y")
    date2 = date(date2.year, date2.month, date2.day)


    # Convert date1 and date2 to pandas.Timestamp for comparison
    date1 = pd.Timestamp(date1)
    date2 = pd.Timestamp(date2)


    gender = request.args.get('gender')
    age = request.args.get('age')


    return_data = []
    avarage_data = {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0}

    df = pd.read_excel('data.xlsx')

    filter_df = df[(df['Day'] >= date1) & (df['Day'] < date2)]
    result = filter_df.to_dict(orient='records')
    
    if gender == 'male':
        gender = 'Male'
    else:
        gender = 'Female'


    if age == 'minor':
        age = '15-25'

    elif age == 'major':
        age = '>25'

    for data in result:
        if data['Age'] == age and data['Gender'] == gender:

            return_data.append(data)
            avarage_data['A'] += data['A']
            avarage_data['B'] += data['B']
            avarage_data['C'] += data['C']
            avarage_data['D'] += data['D']
            avarage_data['E'] += data['E']
            avarage_data['F'] += data['F']
    
    
    if avarage_data['A'] != 0:
        avarage_data['A'] = int(avarage_data['A'] / len(return_data))
    if avarage_data['B'] != 0:
        avarage_data['B'] = int(avarage_data['B'] / len(return_data))
    if avarage_data['C'] != 0:
        avarage_data['C'] = int(avarage_data['C'] / len(return_data))
    if avarage_data['D'] != 0:
        avarage_data['D'] = int(avarage_data['D'] / len(return_data))
    if avarage_data['E'] != 0:
        avarage_data['E'] = int(avarage_data['E'] / len(return_data))
    if avarage_data['F'] != 0:
        avarage_data['F'] = int(avarage_data['F'] / len(return_data))


    return_data.append(avarage_data)
    return return_data

@app.route('/logout')
@login_required
def logout():
    flash('You are Logout Now !')
    logout_user()
    return redirect('login')
if __name__ == "__main__":
    app.run(debug=True)