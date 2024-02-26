import json
import urllib.request
from urllib.request import urlopen

with urllib.request.urlopen(
    "http://learningtool-env.eba-gmtn2kim.us-west-2.elasticbeanstalk.com/SEA-BR/1100"
    ) as url:
    data = json.load(url)
    print(data)
    print(data['departureTime'])
