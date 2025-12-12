from flask import Flask,jsonify, request

app = Flask(__name__)


items=  [
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        ]


@app.route("/", method=['GET'])
def test():
    return "hello"

@app.route("/chats", method=['GET'])
def chats():
    return items




if __main__ =='__main__':
    app.run()
