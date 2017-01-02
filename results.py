uni_file = open('schools.txt', 'r')
rank_file = open('ranking.txt', 'r')
rank_list_file = open('ranking_list.txt', 'w')
top_schools = []

for school_string in uni_file:
  values = school_string.rstrip().split(',')
  top_schools.append(values[1])

ranks = rank_file.readline()
ranks = ranks.rstrip()

ranking = []
count = 1
for rank in ranks.split(','):
  ranking.append(str(count)  + ',' + top_schools[int(rank) - 1])
  count += 1

output = '\n'.join(ranking)
rank_list_file.write(output)
