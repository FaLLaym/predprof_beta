import requests
import time

# 4sensor t+h; rework soon
dic = {'t1': '', 't2': '', 't3': '', 't4': '', 'h1': '', 'h2': '', 'h3': '', 'h4': '', 't_av': '', 'h_av': ''}
# 6 hum sensor; rework soon
hums = {'hum1': '', 'hum2': '', 'hum3': '', 'hum4': '', 'hum5': '', 'hum6': '', 'hum_adv': ''}


# getting temperature+humidity from 4 sensors
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

# getting hum from 6 sensors
def get_hum():
    c = 0
    for i in range(1, 7):
        response_hum = requests.get(f'https://dt.miet.ru/ppo_it/api/hum/{i}').json()
        hums[f'hum{i}'] = response_hum["humidity"]
        c += response_hum["humidity"]
    hums['hum_adv'] = '%.2f' % (c / 6)
    print(hums)


# switching window by patch; state [0, 1]
def switch_window():
    state_value = 0
    url = 'https://dt.miet.ru/ppo_it/api/fork_drive'
    params = {"state": state_value}
    r = requests.patch(url=url, params=params)
    print(r)
    print(r.content)


# switch watering the garden; device_id [1, 6]; state [0, 1]
def switch_water():
    device_id = 1
    state_value = 0
    url = 'https://dt.miet.ru/ppo_it/api/watering'
    params = {"id": device_id, "state": state_value}
    r = requests.patch(url=url, params=params)
    print(r)
    print(r.content)

    
# switch totalHum; state_value [0, 1]
def switch_totalHum():
    state_value = 0
    url = ''
    params = {"state": state_value}
    r = requests.patch(url=url, params=params)


# beta init getting t+h; getting hum
if __name__ == "__main__":
    while True:
        print('t+h')
        get_t_h()
        print('hum')
        get_hum()
        time.sleep(30)
