
string = "5 75"
string = string.replace(' ','')
    
print(string)

import re
b = "5 75{"
b = re.sub('[^0-9]', '', b)

# 123
print(b)