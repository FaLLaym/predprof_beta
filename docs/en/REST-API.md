# REST API Documentation
###### 2nd Edition Ver. 2.31

This file represents the full documentation for use of the REST API of the application.\
\
For your comfort, we use a number of notations for the clarity of the presentation of the material:

    sensor - any detector or tech unit: window, watering, humidity and temperature sensors
    hum - humidity
    temp - temperature

## Get state of sensor

This REST endpoint is intended to return the current state of sensor.\
\
**Attention:**\
*Different types of sensors return different states*

### Request

```http
GET /api/sensor/<string:sensor>/get-state
```

| Variable | Type | Allowed Values | Description |
| :------: | :--: | :------------- | :----------- |
| `sensor` | `string` | <table> <tbody> <tr> <td>`window`</td> </tr> <tr> <td>`total_hum`</td> </tr> <tr> <td>`watering`</td> </tr> </tbody> </table> | Defines the type of sensor |

| Query Param | Type | Allowed Values | Description |
| :---------: | :--: | :------------: | :---------- |
| `id` | `int` | `1≤n` | **Optionally required** to define id for watering |

### Examples using curl

    curl -X GET -i http://localhost:port/api/sensor/window/get-state

    curl -X GET -i http://localhost:port/api/sensor/watering/get-state?id=1

### Response

```javascript
{
    "state": string
}
```

`state` attribute describes the current state of sensor

### Response values

| Attribute | Type |    | Description |
| :-------: | :--: | :- | :---------- |
| `state` | `string` | <table> <tbody> <tr> <td>`Sensor`</td> <td>`Response Values`</td> </tr>  <tr> <td>`window`</td> <td> <table> <tbody> <tr> <td>`"open"`</td> </tr> <tr> <td>`"close"`</td> </tr> </tbody> </table> </td> </tr> <tr> <td>`total_hum`</td> <td> <table> <tbody> <tr> <td>`"on"` </td> </tr> <tr> <td>`"off"`</td> </tr> </tbody> </table> </td> </tr> <tr> <td>`watering`</td> <td> <table> <tbody> <tr> <td>`"on"`</td> </tr> <tr> <td>`"off"`</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> | Different types of sensors return different states |

### Status Codes

| Status Code | Description |
| :-- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

___

## Change state of sensor

This REST endpoint is intended to change the state of sensor.\
\
**Attention:**\
*Different types of sensors require different states*

### Request

```http
POST /api/sensor/<string:sensor>/change-state/<string:state>
```

| Variable | Type | Allowed Values | Description |
| :------: | :--: | :------------- | :---------- |
| `sensor` | `string` | <table> <tbody> <tr> <td>`window`</td> </tr> <tr> <td>`total_hum`</td> </tr> <tr> <td>`watering`</td> </tr> </tbody> </table> | Defines the type of sensor |
| `state` | `string` | <table> <tbody> <tr> <td>`on`</td> <td>`off`</td> </tr> <tr> <td>`open`</td> <td>`close`</td> </tr> </tbody> </table> | Defines the state that the sensor will change to |

| Query Param | Type | Allowed Values | Description |
| :---------: | :--: | :------------- | :---------- |
| `id` | `int` | `1≤n` | **Optionally required** to define id for watering |

### Examples using curl

    curl -X POST -i http://localhost:port/api/sensor/window/change-state/open

    curl -X POST -i http://localhost:port/api/sensor/watering/change-state/off?id=1


### Response

```javascript
{
    "success": bool
}
```

`success` attribute describes if the request was successfull or not (did request change the status of sensor or not)

### Response values

| Attribute | Type | Response Values | Description |
| :-------: | :--: | :-------------- | :---------- |
| `success` | `bool` | <table> <tbody> <tr> <td>`true`</td> </tr> <tr> <td>`false`</td> </tr> </tbody> </table> | Describes if the request was successfull or not |

### Status Codes

| Status Code | Description |
| :-- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

___

## Getting the latest timestamp of event

This REST endpoint is intended to return the latest timestamp when some event happened.\
For example, we need to know when the window was opened last time.
\
**Attention:**\
*Different types of sensors require different states*

### Request

```http
GET /api/sensor/<string:sensor>/last-state-change/<string:state>
```

| Variable | Type | Allowed Values | Description |
| :------: | :--: | :------------- | :---------- |
| `sensor` | `string` | <table> <tbody> <tr> <td>`window`</td> </tr> <tr> <td>`total_hum`</td> </tr> <tr> <td>`watering`</td> </tr> </tbody> </table> | Defines the type of sensor |
| `state` | `string` | <table> <tbody> <tr> <td>`on`</td> <td>`off`</td> </tr> <tr> <td>`open`</td> <td>`close`</td> </tr> </tbody> </table> | Defines the state that corresponds to the event |

| Query Param | Type | Allowed Values | Description |
| :---------: | :--: | :------------- | :---------- |
| `id` | `int` | `1≤n` | **Optionally required** to define id for watering |

### Examples using curl

    curl -X GET -i http://localhost:port/api/sensor/window/last-state-change/open

    curl -X GET -i http://localhost:port/api/sensor/watering/last-state-change/on?id=1

### Response

```javascript
{
    "date": string
}
```

`date` attribute represents the latest timestamp of the event

### Response values

| Attribute | Type | Response Values | Description |
| :-------: | :--: | :-------------- | :---------- |
| `date` | `string` | `YYYY-mm-dd HH:MM:SS.sss` date format | The timestamp of event. Satisfies the ISO 8601 format. Example: "2023-01-07 15:02:27.406" |

### Status Codes

| Status Code | Description |
| :-- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

___

## Get temp_hum data

This REST endpoint is intended to get rows of data-stamps of the air temperature and humidity sensors.\

### Request

```http
GET /api/temp_hum/get-data
```

| Query Param | Type | Allowed Values | Description |
| :---------: | :--: | :------------- | :---------- |
| `t` | `string` | `/^[\d]+[SMHdmY]$/` | Defines the period of time from when we want to get the rows of data. Examples: to get the data for the last 1 day we use `t=1d`, to get the data for the last 30 minutes we use `t=30M` |

### Examples using curl

    curl -X GET -i http://localhost:port/api/temp_hum/get-data

    curl -X GET -i http://localhost:port/api/temp_hum/get-data?t=5M

    curl -X GET -i http://localhost:port/api/temp_hum/get-data?t=7d

### Response

```javascript
{
    "rows": array(date, t1, ..., h1, ..., t_avg, h_avg)
}
```

`rows` attribute contains an array with rows of data-stamps

### Response values

| Attribute | Type | Response Values | Description |
| :-------: | :--: | :-------------- | :---------- |
| `rows` | `array` | <table> <tbody> <tr> <td>**Attribute**</td> <td>**Type**</td> <td>**Response Values**</td> <td>**Description**</td> </tr> <tr> <td>`date`</td> <td>`string`</td> <td>`YYYY-mm-dd HH:MM:SS.sss` date format</td> <td>The timestamp of the record. Satisfies the ISO 8601 format. Example: "2023-01-07 15:02:27.406"</td> </tr> <tr> <td>`t{n}`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Air temperature from n temp_hum sensor. **Attention** if data wasn't fetched by the sensor, the value will be null</td> </tr> <tr> <td>`h{n}`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Air humidity from n temp_hum sensor. **Attention** if data wasn't fetched by the sensor, the value will be null</td> </tr> <tr> <td>`t_avg`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Avarage air temperature. If any sensor registered data, the value will be null</td> </tr> <tr> <td>`h_avg`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Average air humidity. If neither one sensor registered any data, the value will be null</td> </tr> </tbody> </table> | Array with rows of data-stamps |

### Status Codes

| Status Code | Description |
| :-- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

___

## Get hum data

some text #TODO

### Request

```http
GET /api/hum/get-data
```

| Query Param | Type | Allowed Values | Description |
| :---------: | :--: | :------------- | :---------- |
| `t` | `string` | `/^[\d]+[SMHdmY]$/` | Defines the period of time from when we want to get the rows of data. Examples: to get the data for the last 1 day we use `t=1d`, to get the data for the last 30 minutes we use `t=30M` |

### Examples using curl

    curl -X GET -i http://localhost:port/api/hum/get-data

    curl -X GET -i http://localhost:port/api/hum/get-data?t=5M

    curl -X GET -i http://localhost:port/api/hum/get-data?t=7d

### Response

```javascript
{
    "rows": array(rowid, date, h1, ..., h_avg)
}
```

`rows` attribute contains an array with rows of data-stamps

### Response values

| Attribute | Type | Response Values | Description |
| :-------: | :--: | :-------------- | :---------- |
| `rows` | `array` | <table> <tbody> <tr> <td>**Attribute**</td> <td>**Type**</td> <td>**Response Values**</td> <td>**Description**</td> </tr> <tr> <td>`date`</td> <td>`string`</td> <td>`YYYY-mm-dd HH:MM:SS.sss` date format</td> <td>The timestamp of the record. Satisfies the ISO 8601 format. Example: "2023-01-07 15:02:27.406"</td> </tr> <tr> <td>`h{n}`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Ground temperature from n hum sensor. **Attention** if data wasn't fetched by the sensor, the value will be null</td> </tr> <tr> <td>`h_avg`</td> <td><table> <tbody> <tr> <td>`float` </td> </tr> <tr> <td>`null`</td> </tr> </tbody> </table></td> <td></td> <td>Average air humidity. If neither one sensor registered any data, the value will be null</td> </tr> </tbody> </table> | Array with rows of data-stamps |

### Status Codes

| Status Code | Description |
| :-- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |

___
