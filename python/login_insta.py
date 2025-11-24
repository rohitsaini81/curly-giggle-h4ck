from instagrapi import Client

cl = Client()
username='to_greeb'
password='Rohit@1234'


#session=cl.load_settings("session.json")
#print(session)
#cl.login_by_sessionid(session['client_session_id'])

cl.set_settings({})
cl.login(username, password)
cl.dump_settings("session.json")

#cl.login(username,password)
#cl.dump_settings("session.json")



#user_id = cl.user_id_from_username(username)
#medias = cl.user_medias(user_id, 20)
