import urllib.request

url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Emblem_of_Karnataka.svg/512px-Emblem_of_Karnataka.svg.png"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

with urllib.request.urlopen(req) as response:
    with open('emblem.png', 'wb') as out_file:
        out_file.write(response.read())

print("Downloaded emblem.png successfully")
