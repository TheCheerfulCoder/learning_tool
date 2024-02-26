from urllib.request import urlopen

link = "http://learningtool-env.eba-gmtn2kim.us-west-2.elasticbeanstalk.com/SEA-BR/1100"
f = urlopen(link)
myfile = f.read()
print(myfile)
