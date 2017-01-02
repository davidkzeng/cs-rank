import numpy as np

from calc_pagerank import calc_uni_ranks

rank_list_file = open('ranking_list.txt', 'w')
top_schools = []

ranking = []
count = 1

(top_schools, uni_ranks) = calc_uni_ranks()
sorted_dist = np.sort(uni_ranks)[::-1]
ordering = np.argsort(uni_ranks)[::-1]

for rank in ordering:
  ranking.append(str(count)  + ',' + top_schools[rank] + ',' + str(sorted_dist[count - 1]))
  count += 1

output = '\n'.join(ranking)
rank_list_file.write(output)
