import numpy as np

from build_markov import generate_graph

def pagerank(norm_adj, damp):
  norm_adj = norm_adj.T
  N = norm_adj.shape[0]

  base = np.ones(N, dtype=np.float64) * (1 - damp) / N

  cur_dist = np.ones(N, dtype=np.float64) / N
  prev_dist = np.zeros(N, dtype=np.float64)

  iters = 0
  while iters == 0 or np.linalg.norm(cur_dist - prev_dist, 2) > 0.00001:
    prev_dist = cur_dist

    cur_dist = base + (damp * norm_adj.dot(cur_dist))

    cur_dist = cur_dist / np.linalg.norm(cur_dist, 1)
    iters += 1

  return cur_dist

def calc_uni_ranks():
  (top_schools, adj) = generate_graph()
  np_adj = np.array(adj, dtype=np.float64)
  np_adj_norm = (np_adj.T / np_adj.sum(axis=1)).T

  uni_ranks = pagerank(np_adj_norm, 0.7)
  return (top_schools, uni_ranks)

calc_uni_ranks()