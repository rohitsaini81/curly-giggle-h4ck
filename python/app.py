from flask import Flask,jsonify, request

app = Flask(__name__)


items=  [
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        {"id":1,"title":"Marval"},
        ]


@app.route("/", methods=['GET'])
def test():
    return "hello"

@app.route("/chats", methods=['GET'])
def chats():
    return items




if __name__ =='__main__':
    app.run()
