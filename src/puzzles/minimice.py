import os
import json
import random

# List of files
files = [
    'ratings_0_500.json',
    'ratings_1000_1500.json',
    'ratings_1500_2000.json',
    'ratings_2000_2500.json',
    'ratings_2500_3000.json',
    'ratings_3000_3500.json',
    'ratings_500_1000.json'
]

pc_path = "./"

# Loop over each file
for file in files:
    with open(pc_path + file, 'r') as json_file:
        data = json.load(json_file) # Loads the data from the file

        if len(data) > 3000:
            data = random.sample(data, 3000) # Randomly samples 3000 elements from array if it's longer

        new_file = file.replace('.json', '_new.json')
        with open(pc_path + new_file, 'w') as nf:
            json.dump(data, nf) # Writes the new array to the new file

    os.rename(pc_path + file, pc_path + file.replace('.json', '_original.json'))
    os.rename(pc_path + file.replace('.json', '_new.json'), pc_path + file)
