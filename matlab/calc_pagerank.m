% Requires norm_adj is a square matrix
% norm_adj uses the standard representation for a markov chain
% where (i,j) represents the probability of transition to state j

function [limit_dist] = calc_pagerank(norm_adj, damp)
    norm_adj = norm_adj';
    N = size(norm_adj, 1);
    base_vec(1:N, 1) = (1 - damp) / N;

    cur_dist(1:N, 1) = 1 / N;
    prev_dist = zeros(N);
    while isequal(prev_dist, zeros(N)) || (norm(prev_dist - cur_dist, 2) > 0.0001)
        prev_dist = cur_dist;
        cur_dist = base_vec + (damp * norm_adj * cur_dist);

        % renormalize to minimize rounding error
        cur_dist = cur_dist / norm(cur_dist, 1);
    end
    limit_dist = cur_dist;