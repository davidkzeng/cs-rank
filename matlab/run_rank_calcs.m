adj = csvread('adj.txt');
m = size(adj, 1);

normalized_adj = normr(adj);

uni_ranks = calc_pagerank(normalized_adj, 0.7);

[sortedX, sortedIndices] = sort(uni_ranks, 'descend');

% For final graph, find how much each uni contributes to other uni's rank
normalized_influence = (normalized_adj' * diag(uni_ranks))';
csvwrite('ranking.txt', [sortedIndices sortedX]');