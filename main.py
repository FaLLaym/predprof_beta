# import requests
# import time
#
# # 4sensor t+h; 1_1 --> 1_4 == t; 2_1 --> 2_4 == h
# dic = {'t1': '', 't2': '', 't3': '', 't4': '', 'h1': '', 'h2': '', 'h3': '', 'h4': '', 't_av': '', 'h_av': ''}
#
#
# def get_t_h():
#     ct = 0
#     ch = 0
#     for i in range(1, 5):
#         response_t_h = requests.get(f'https://dt.miet.ru/ppo_it/api/temp_hum/{i}').json()
#         dic[f't{i}'] = response_t_h['temperature']
#         dic[f'h{i}'] = response_t_h['humidity']
#         ct += response_t_h['temperature']
#         ch += response_t_h['humidity']
#     dic['t_av'] = '%.2f' % (ct/4)
#     dic['h_av'] = '%.2f' % (ch/4)
#     print(dic)
#
# while True:
#     get_t_h()
#     time.sleep(30)

import requests
state_value = 1
url = 'https://dt.miet.ru/ppo_it/api/fork_drive'
data = {"state": state_value}
r = requests.patch(url=url,data=data)
print(r)



