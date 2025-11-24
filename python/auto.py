from instagram import login, list_chats, send_message


cl = login()
threads = list_chats(cl) # array

print(threads)

#send_message(cl, selected_thread)

