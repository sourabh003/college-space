import string
import random

def uniqueID():  
    N = 10
    res = ''.join(random.choices(string.ascii_lowercase +string.digits, k = N))
    return str(res)