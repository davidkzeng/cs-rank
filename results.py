import numpy as np

from calc_pagerank import calc_uni_ranks
from field import FieldCategory as FC

def output_ranking(file, cat=None):
  top_schools = []

  ranking = []
  count = 1

  (top_schools, uni_ranks) = calc_uni_ranks(cat)
  sorted_dist = np.sort(uni_ranks)[::-1]
  ordering = np.argsort(uni_ranks)[::-1]

  for rank in ordering:
    ranking.append(str(count)  + ',' + top_schools[rank] + ',' + str(sorted_dist[count - 1]))
    count += 1

  output = '\n'.join(ranking)
  file.write(output)

rank_list_file = open('ranking_list.txt', 'w')
output_ranking(rank_list_file)

rank_list_theory_file = open('ranking_list_theory.txt', 'w')
output_ranking(rank_list_theory_file, FC.Theory)

rank_list_ai_file = open('ranking_list_ai.txt', 'w')
output_ranking(rank_list_ai_file, FC.AI)

rank_list_systems_file = open('ranking_list_systems.txt', 'w')
output_ranking(rank_list_systems_file, FC.Systems)



