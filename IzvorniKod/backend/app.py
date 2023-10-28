
from flask import Flask, render_template_string, request, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/home')
def home():
    return render_template_string('<h1>Hello World!</h1>')

if __name__ == '__main__':
    app.run()