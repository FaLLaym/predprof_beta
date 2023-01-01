import requests
import datetime

# start id (mb we don`t need it)
id = 1


# get temperature+humidity from 4 sensors and return tuple.type
def get_t_h():
    tem_hum = []
    ct = 0
    ch = 0
    tem_hum.append(id)
    tem_hum.append(str(datetime.datetime.now())[:19])
    for i in range(1, 5):
        response_t_h = requests.get(f'https://dt.miet.ru/ppo_it/api/temp_hum/{i}').json()
        tem_hum.append(response_t_h['humidity'])
        tem_hum.append(response_t_h['temperature'])
        ct += response_t_h['temperature']
        ch += response_t_h['humidity']
    tem_hum.append('%.2f' % (ct / 4))
    tem_hum.append('%.2f' % (ch / 4))
    return tuple(tem_hum)


# get hum from 6 sensors and return tuple.type
def get_hum():
    hum = []
    global id
    c = 0
    hum.append(id)
    hum.append(str(datetime.datetime.now())[:19])
    for i in range(1, 7):
        response_hum = requests.get(f'https://dt.miet.ru/ppo_it/api/hum/{i}').json()
        hum.append(response_hum["humidity"])
        c += response_hum["humidity"]
    hum.append('%.2f' % (c / 6))
    id += 1
    return tuple(hum)


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
