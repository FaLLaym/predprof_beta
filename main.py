import requests
import time

# 4sensor t+h; rework soon
dic = {'t1': '', 't2': '', 't3': '', 't4': '', 'h1': '', 'h2': '', 'h3': '', 'h4': '', 't_av': '', 'h_av': ''}


# getting temperature+humidity
def get_t_h():
    ct = 0
    ch = 0
    for i in range(1, 5):
        response_t_h = requests.get(f'https://dt.miet.ru/ppo_it/api/temp_hum/{i}').json()
        dic[f't{i}'] = response_t_h['temperature']
        dic[f'h{i}'] = response_t_h['humidity']
        ct += response_t_h['temperature']
        ch += response_t_h['humidity']
    dic['t_av'] = '%.2f' % (ct / 4)
    dic['h_av'] = '%.2f' % (ch / 4)
    print(dic)

# switching window by patch
def switch_window():
    state_value = 0
    url = 'https://dt.miet.ru/ppo_it/api/fork_drive/'
    params = {"state": state_value}
    r = requests.patch(url=url, params=params)
    print(r)
    print(r.content)

# prog init
while True:
    get_t_h()
    time.sleep(30)



